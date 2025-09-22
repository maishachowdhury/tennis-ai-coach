import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import imageCompression from "browser-image-compression";
import App from "./App";

jest.mock(
  "axios",
  () => ({
    post: jest.fn(),
  }),
  { virtual: true }
);

jest.mock("browser-image-compression", () => jest.fn());

const mockDataUrl = "data:image/jpeg;base64,mock-result";

class MockFileReader {
  constructor() {
    this.onload = null;
    this.result = null;
    this.readAsDataURL = jest.fn(() => {
      this.result = mockDataUrl;
      setTimeout(() => {
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      }, 0);
    });
    MockFileReader.instances.push(this);
  }
}

MockFileReader.instances = [];

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    MockFileReader.instances = [];
    window.FileReader = MockFileReader;
    global.FileReader = MockFileReader;
  });

  test("renders the main heading and analyze button", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /tennis ai coach/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analyze/i })).toBeInTheDocument();
  });

  test("compresses an uploaded image and shows a preview", async () => {
    const compressedBlob = new Blob(["compressed"], { type: "image/jpeg" });
    imageCompression.mockResolvedValue(compressedBlob);

    render(<App />);

    const fileInput = screen.getByLabelText(/upload swing photo/i);
    const file = new File(["swing"], "swing.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, file);

    await waitFor(() => expect(imageCompression).toHaveBeenCalled());

    expect(imageCompression).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      })
    );

    await waitFor(() =>
      expect(MockFileReader.instances.length).toBeGreaterThan(0)
    );

    const readerInstance = MockFileReader.instances[0];
    expect(readerInstance.readAsDataURL).toHaveBeenCalledWith(compressedBlob);

    expect(await screen.findByText(/compressed image preview/i)).toBeInTheDocument();
    expect(await screen.findByAltText(/preview/i)).toHaveAttribute("src", mockDataUrl);
  });

  test("calls the OpenAI API and displays feedback after analyzing", async () => {
    imageCompression.mockResolvedValue(new Blob(["compressed"], { type: "image/jpeg" }));

    const feedbackText = "Great follow-through.";
    let resolvePost;
    axios.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePost = () => resolve({ data: { output_text: feedbackText } });
        })
    );

    render(<App />);

    const fileInput = screen.getByLabelText(/upload swing photo/i);
    const file = new File(["swing"], "swing.jpg", { type: "image/jpeg" });

    await userEvent.upload(fileInput, file);

    await waitFor(() =>
      expect(MockFileReader.instances.length).toBeGreaterThan(0)
    );

    await screen.findByAltText(/preview/i);

    const analyzeButton = screen.getByRole("button", { name: /analyze/i });
    await userEvent.click(analyzeButton);

    await waitFor(() =>
      expect(analyzeButton).toHaveTextContent(/analyzing/i)
    );

    expect(axios.post).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        model: "gpt-4o-mini",
        input: [
          expect.objectContaining({
            content: expect.arrayContaining([
              expect.objectContaining({ type: "input_text" }),
              expect.objectContaining({ type: "input_image", image_url: mockDataUrl }),
            ]),
          }),
        ],
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        }),
      })
    );

    resolvePost();

    await waitFor(() =>
      expect(analyzeButton).toHaveTextContent(/^Analyze$/i)
    );

    expect(await screen.findByText(feedbackText)).toBeInTheDocument();
  });
});
