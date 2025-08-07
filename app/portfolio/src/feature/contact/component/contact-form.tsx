"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@package/shadcn";
import { Loader2Icon, Mail, Send } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { useSendEmail } from "../utility/use-send-email";

// 📝 NOTE: https://www.shadcn-form.com/
export default function ContactForm() {
  const { t, i18n: { language } } = useTranslation();

  const contactFormSchema = useMemo(() => z.object({
    name: z.string().min(1, t("Name is required")),
    email: z.string().email(t("Invalid email address")),
    message: z.string().min(1, t("Message is required")),
  }), [t]);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Update validation messages when language changes for touched fields
  useEffect(() => {
    const touchedFields = form.formState.touchedFields;
    // Check if there are any touched fields
    const hasTouchedFields = Object.keys(touchedFields).some((key) => {
      const fieldKey = key as keyof typeof touchedFields;
      return touchedFields[fieldKey];
    });

    // Only trigger validation if there are touched fields
    if (hasTouchedFields) {
      form.trigger();
    }
  }, [language, form]);

  const onSuccess = useCallback(() => {
    toast.success(t("Email sent successfully"));
    form.reset();
  }, [t, form]);

  const onError = useCallback((error: Error) => {
    toast.error(`${t("Failed to send email")}: ${error.message}`);
  }, [t]);

  const { mutate, isPending } = useSendEmail({
    onSuccess,
    onError,
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    const {
      name,
      email,
      message,
    } = values;
    mutate([
      "service_9fonc4c",
      "template_zar4u59",
      {
        from_name: name,
        from_email: email,
        message,
        to_email: "isaiariva95@gmail.com",

      },
      "BKQsc7di02MfnvyP-",
    ]);
  }

  return (
    <div className="flex items-center justify-center px-1 lg:px-4 z-10 w-full">
      <Card className="mx-auto w-full lg:max-w-md lg:min-w-sm lg:w-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-LibreFranklin">
            <Mail className="mr-3" />
            {t("Contact Me")}
          </CardTitle>
          <CardDescription>
            {t("Please fill out the form below, and I will get back to you shortly")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-8">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="font-LibreFranklin" htmlFor="name">{t("Name")}</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          type="text"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="font-LibreFranklin" htmlFor="email">{t("Email")}</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder={`${t("yourEmail@mail.com")}`}
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="font-LibreFranklin" htmlFor="message">{t("Message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder={t("Your message")}
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full py-6 cursor-pointer" disabled={isPending}>
                  {isPending ? <Loader2Icon className="animate-spin mr-2" data-testid="lucide-loader-circle" /> : <Send className="mr-2" />}
                  {isPending ? t("Sending") : t("Send Email")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
