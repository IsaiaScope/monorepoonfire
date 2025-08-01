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
import { Loader2Icon, Send } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { useSendEmail } from "../utility/use-send-email";

export default function ContactForm() {
  const { t } = useTranslation();

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

  const { mutate, isPending } = useSendEmail({
    onSuccess: () => {
      toast.success("Email sent successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
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
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center px-4 z-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Us</CardTitle>
          <CardDescription>
            Please fill out the form below and we will get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">{t("Name")}</FormLabel>
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
                      <FormLabel htmlFor="email">{t("Email")}</FormLabel>
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
                      <FormLabel htmlFor="message">{t("Message")}</FormLabel>
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

                <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                  {isPending ? <Loader2Icon className="animate-spin mr-2" /> : <Send className="mr-2" />}
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
