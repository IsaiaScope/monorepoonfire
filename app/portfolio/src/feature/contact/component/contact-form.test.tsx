import userEvent from "@testing-library/user-event";
import { act } from "react";
import { toast } from "sonner";
import { vi } from "vitest";

import type { TestRenderOptions } from "../../../test/set-up-test";

import { render, screen, waitFor } from "../../../test/set-up-test";
// Import the mocked module
import { useSendEmail } from "../utility/use-send-email";
import ContactForm from "./contact-form";

// Mock the useSendEmail hook
const mockMutate = vi.fn();

// Import and mock the module
vi.mock("../utility/use-send-email", () => ({
  useSendEmail: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("contactForm Component", () => {
  // Get references to the mocked functions
  const mockToastSuccess = vi.mocked(toast.success);
  const mockToastError = vi.mocked(toast.error);
  const mockUseSendEmail = vi.mocked(useSendEmail);

  const renderContactForm = (options: TestRenderOptions = {}) =>
    render(<ContactForm />, options);

  const validFormData = {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "This is a test message for the contact form.",
  };

  // Type definitions for better type safety
  type OnSuccessCallback = (data: any, variables: any, context: any) => void;
  type OnErrorCallback = (error: Error, variables: any, context: any) => void;
  type UseMutationOptions = {
    onSuccess?: OnSuccessCallback;
    onError?: OnErrorCallback;
  };

  // Helper function to create a mock mutation result with proper typing
  const createMockMutationResult = (overrides = {}): ReturnType<typeof useSendEmail> => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
    error: null,
    data: undefined,
    variables: undefined,
    reset: vi.fn(),
    status: "idle" as const,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    mutateAsync: vi.fn(),
    context: undefined,
    submittedAt: 0,
    ...overrides,
  });

  // Helper function to setup callback capture with proper typing
  const setupCallbackCapture = () => {
    let onSuccessCallback: OnSuccessCallback | undefined;
    let onErrorCallback: OnErrorCallback | undefined;

    const mockImplementation = (options?: UseMutationOptions) => {
      onSuccessCallback = options?.onSuccess;
      onErrorCallback = options?.onError;
      return createMockMutationResult({ mutate: mockMutate });
    };

    mockUseSendEmail.mockImplementation(mockImplementation as any);

    return {
      onSuccessCallback: () => onSuccessCallback,
      onErrorCallback: () => onErrorCallback,
      triggerSuccess: (data: any, variables: any, context: any = {}) => {
        if (onSuccessCallback) {
          act(() => {
            onSuccessCallback!(data, variables, context);
          });
        }
      },
      triggerError: (error: Error, variables: any, context: any = {}) => {
        if (onErrorCallback) {
          act(() => {
            onErrorCallback!(error, variables, context);
          });
        }
      },
    };
  };

  // Helper to create standard email variables for tests
  const createEmailVariables = () => [
    "service_9fonc4c",
    "template_zar4u59",
    {
      from_name: validFormData.name,
      from_email: validFormData.email,
      message: validFormData.message,
      to_email: "isaiariva95@gmail.com",
    },
    "BKQsc7di02MfnvyP-",
  ];

  // Helper to create success response
  const createSuccessResponse = () => ({ status: 200, text: "OK" });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSendEmail.mockReturnValue(createMockMutationResult());
  });
  // BASIC STRUCTURE TESTS
  // =============================================================================
  describe("basic Structure", () => {
    it("renders the contact form with all required fields", () => {
      renderContactForm();

      // Check for form title
      expect(screen.getByText("Contact Me")).toBeInTheDocument();

      // Check for form description
      expect(screen.getByText(/please fill out the form below/i)).toBeInTheDocument();

      // Check for form fields
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

      // Check for submit button
      expect(screen.getByRole("button", { name: /send email/i })).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageTextarea = screen.getByLabelText(/message/i);
      // Check that inputs have proper IDs
      expect(nameInput).toHaveAttribute("id", "name");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(messageTextarea).toHaveAttribute("id", "message");

      // Check that labels have proper for attributes
      expect(screen.getByText(/^name$/i)).toHaveAttribute("for", "name");
      expect(screen.getByText(/^email$/i)).toHaveAttribute("for", "email");
      expect(screen.getByText(/^message$/i)).toHaveAttribute("for", "message");
      // Check input types
      expect(nameInput).toHaveAttribute("type", "text");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(messageTextarea.tagName.toLowerCase()).toBe("textarea");

      // Check autocomplete attributes
      expect(nameInput).toHaveAttribute("autocomplete", "name");
      expect(emailInput).toHaveAttribute("autocomplete", "email");
      expect(messageTextarea).toHaveAttribute("autocomplete", "off");

      // Check placeholders
      expect(nameInput).toHaveAttribute("placeholder", "John Doe");
      expect(emailInput).toHaveAttribute("placeholder", "yourEmail@mail.com");
      expect(messageTextarea).toHaveAttribute("placeholder", "Your message");
    });
  });

  // =============================================================================
  // FORM VALIDATION TESTS
  // =============================================================================
  describe("form Validation", () => {
    it("shows validation errors for empty required fields when form is submitted", async () => {
      const user = userEvent.setup();
      renderContactForm();

      const submitButton = screen.getByRole("button", { name: /send email/i });

      // Submit form without filling any fields
      await user.click(submitButton);

      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });

      // Ensure form was not submitted
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("shows email validation error for invalid email format", async () => {
      const user = userEvent.setup();
      renderContactForm();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /send email/i });

      // Fill in invalid email
      await user.type(emailInput, "invalid@email");
      await user.click(submitButton);

      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("validates fields individually as user types and moves to next field", async () => {
      const user = userEvent.setup();
      renderContactForm();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);

      // Focus name field and leave it empty, then move to email
      await user.click(nameInput);
      await user.tab(); // Move focus away from name field

      // Type invalid email
      await user.type(emailInput, "invalid@email");
      await user.tab(); // Move focus away from email field
      const submitButton = screen.getByRole("button", { name: /send email/i });
      await user.click(submitButton);
      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it("clears validation errors when valid input is provided", async () => {
      const user = userEvent.setup();
      renderContactForm();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /send email/i });

      // First, trigger validation errors
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });

      // Now fill in valid data
      await user.type(nameInput, validFormData.name);
      await user.type(emailInput, validFormData.email);

      // Wait for errors to clear
      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/invalid email address/i)).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // FORM SUBMISSION TESTS
  // =============================================================================
  describe("form Submission", () => {
    it("submits form with correct data when all fields are valid", async () => {
      const user = userEvent.setup();
      renderContactForm();

      // Fill in all form fields
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);

      // Submit form
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Verify mutate was called with correct parameters
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith([
          "service_9fonc4c",
          "template_zar4u59",
          {
            from_name: validFormData.name,
            from_email: validFormData.email,
            message: validFormData.message,
            to_email: "isaiariva95@gmail.com",
          },
          "BKQsc7di02MfnvyP-",
        ]);
      });
    });

    it("shows loading state while form is being submitted", async () => {
      // Mock the hook to return isPending: true
      mockUseSendEmail.mockReturnValue(createMockMutationResult({
        mutate: mockMutate,
        isPending: true,
      }));

      renderContactForm();

      // Check loading state
      expect(screen.getByRole("button", { name: /sending/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();

      // Verify spinner icon is present
      expect(screen.getByTestId("lucide-loader-circle")).toBeInTheDocument();
    });

    it("prevents multiple submissions while form is pending", async () => {
      const user = userEvent.setup();

      // Mock the hook to return isPending: true
      mockUseSendEmail.mockReturnValue(createMockMutationResult({
        mutate: mockMutate,
        isPending: true,
      }));

      renderContactForm();

      // Fill in form
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);

      // Try to click the disabled submit button
      const disabledButton = screen.getByRole("button", { name: /sending/i });
      expect(disabledButton).toBeDisabled();

      await user.click(disabledButton);

      // Since the button is disabled, mutate should not be called
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  // =============================================================================
  // SUCCESS TOAST TESTS
  // =============================================================================
  describe("success Toast Notifications", () => {
    it("shows success toast when email is sent successfully", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate successful submission
      callbackSetup.triggerSuccess(createSuccessResponse(), createEmailVariables());

      // Wait for success toast
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Email sent successfully");
      });
    });

    it("resets form after successful submission", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      // Fill and submit form
      await user.type(nameInput, validFormData.name);
      await user.type(emailInput, validFormData.email);
      await user.type(messageInput, validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate successful submission
      callbackSetup.triggerSuccess(createSuccessResponse(), createEmailVariables());

      // Wait for form to reset
      await waitFor(() => {
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(messageInput).toHaveValue("");
      });
    });

    it("shows success toast in Italian when language is set to Italian", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm({ language: "it-IT" });

      // Fill and submit form
      await user.type(screen.getByLabelText(/nome/i), validFormData.name);
      await user.type(screen.getByLabelText(/e-mail/i), validFormData.email);
      await user.type(screen.getByLabelText(/messaggio/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /invia email/i }));

      // Simulate successful submission
      callbackSetup.triggerSuccess(createSuccessResponse(), createEmailVariables());

      // Wait for success toast in Italian
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Email inviata con successo");
      });
    });
  });

  // =============================================================================
  // ERROR TOAST TESTS
  // =============================================================================
  describe("error Toast Notifications", () => {
    it("shows error toast when email sending fails", async () => {
      const user = userEvent.setup();
      const errorMessage = "Network error";
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate error
      callbackSetup.triggerError(new Error(errorMessage), createEmailVariables());

      // Wait for error toast
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          `Failed to send email: ${errorMessage}`,
        );
      });
    });

    it("shows error toast in Italian when language is set to Italian and sending fails", async () => {
      const user = userEvent.setup();
      const errorMessage = "Network error";
      const callbackSetup = setupCallbackCapture();

      renderContactForm({ language: "it-IT" });

      // Fill and submit form
      await user.type(screen.getByLabelText(/nome/i), validFormData.name);
      await user.type(screen.getByLabelText(/e-mail/i), validFormData.email);
      await user.type(screen.getByLabelText(/messaggio/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /invia email/i }));

      // Simulate error
      callbackSetup.triggerError(new Error(errorMessage), createEmailVariables());

      // Wait for error toast in Italian
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          `Invio dell'email fallito: ${errorMessage}`,
        );
      });
    });

    it("does not reset form when email sending fails", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      // Fill and submit form
      await user.type(nameInput, validFormData.name);
      await user.type(emailInput, validFormData.email);
      await user.type(messageInput, validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate error
      callbackSetup.triggerError(new Error("Network error"), createEmailVariables());

      // Wait for error handling to complete
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled();
      });

      // Verify form values are preserved
      expect(nameInput).toHaveValue(validFormData.name);
      expect(emailInput).toHaveValue(validFormData.email);
      expect(messageInput).toHaveValue(validFormData.message);
    });

    it("handles emailjs service errors gracefully", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate service error
      callbackSetup.triggerError(new Error("Service ID is invalid"), createEmailVariables());

      // Wait for error toast with specific error message
      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Failed to send email: Service ID is invalid",
        );
      });
    });
  });

  // =============================================================================
  // INTERNATIONALIZATION TESTS
  // =============================================================================
  describe("internationalization", () => {
    it("renders form in English by default", () => {
      renderContactForm();

      expect(screen.getByText("Contact Me")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Message")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send email/i })).toBeInTheDocument();
    });

    it("renders form in Italian when language is set to Italian", () => {
      renderContactForm({ language: "it-IT" });

      expect(screen.getByText("Contattami")).toBeInTheDocument();
      expect(screen.getByText("Nome")).toBeInTheDocument();
      expect(screen.getByText("E-mail")).toBeInTheDocument();
      expect(screen.getByText("Messaggio")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /invia email/i })).toBeInTheDocument();
    });

    it("shows validation errors in Italian when language is set to Italian", async () => {
      const user = userEvent.setup();
      renderContactForm({ language: "it-IT" });

      const submitButton = screen.getByRole("button", { name: /invia email/i });

      // Submit form without filling any fields
      await user.click(submitButton);

      // Wait for validation errors in Italian
      await waitFor(() => {
        expect(screen.getByText(/il nome è obbligatorio/i)).toBeInTheDocument();
        expect(screen.getByText(/indirizzo email non valido/i)).toBeInTheDocument();
        expect(screen.getByText(/il messaggio è obbligatorio/i)).toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // ACCESSIBILITY TESTS
  // =============================================================================
  describe("accessibility", () => {
    it("maintains focus management during form submission", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      const submitButton = screen.getByRole("button", { name: /send email/i });

      // Fill form and focus submit button
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);

      // Focus the submit button before clicking
      act(() => {
        submitButton.focus();
      });
      expect(submitButton).toHaveFocus();

      // Submit form
      await user.click(submitButton);

      // Simulate successful submission and wait for all updates to complete
      await act(async () => {
        callbackSetup.triggerSuccess(createSuccessResponse(), createEmailVariables());
      });

      // After submission, the button should still be focusable (but reset to "Send Email")
      await waitFor(() => {
        const resetButton = screen.getByRole("button", { name: /send email/i });
        expect(resetButton).toBeInTheDocument();
      });
    });

    it("provides proper ARIA attributes for form validation", async () => {
      const user = userEvent.setup();
      renderContactForm();

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole("button", { name: /send email/i });

      // Submit form to trigger validation
      await user.click(submitButton);

      // Wait for validation error and check ARIA attributes
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("announces form submission status to screen readers", async () => {
      const user = userEvent.setup();
      const callbackSetup = setupCallbackCapture();

      renderContactForm();

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), validFormData.name);
      await user.type(screen.getByLabelText(/email/i), validFormData.email);
      await user.type(screen.getByLabelText(/message/i), validFormData.message);
      await user.click(screen.getByRole("button", { name: /send email/i }));

      // Simulate successful submission
      callbackSetup.triggerSuccess(createSuccessResponse(), createEmailVariables());

      // Check that success is communicated via toast (which should be announced)
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("Email sent successfully");
      });
    });
  });
});
