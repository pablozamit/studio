
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { useGuardianStore } from "@/hooks/use-guardian-store"; // Import type

const formSchema = z.object({
  guardianEmail: z.string().trim().email({ message: "Invalid email address." }),
  confirmGuardianEmail: z.string().trim().email({ message: "Invalid email address." }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine(data => data.guardianEmail === data.confirmGuardianEmail, {
  message: "Guardian emails do not match.",
  path: ["confirmGuardianEmail"],
});

type GuardianSetupFormProps = {
  onSetupComplete: (email: string) => void;
};

export function GuardianSetupForm({ onSetupComplete }: GuardianSetupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guardianEmail: "",
      confirmGuardianEmail: "",
      termsAccepted: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSetupComplete(values.guardianEmail);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Guardian Angel Setup</CardTitle>
          <CardDescription>
            Configure your guardian to receive alerts and keep your browsing safe. This email cannot be changed later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="guardianEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian's Email</FormLabel>
                    <FormControl>
                      <Input placeholder="guardian@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmGuardianEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Guardian's Email</FormLabel>
                    <FormControl>
                      <Input placeholder="guardian@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a>.
                      </FormLabel>
                      <FormDescription>
                        This is a demo application. No actual screen monitoring or email sending will occur.
                      </FormDescription>
                       <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg">
                Set Guardian & Start Protecting
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
