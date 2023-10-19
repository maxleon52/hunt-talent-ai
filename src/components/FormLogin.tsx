"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { BrainCircuit, User } from "lucide-react";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  message: z.string().min(2, {
    message: "Mensagem deve ter no minimo 10 caracteres.",
  }),
});

type FormData = z.infer<typeof schema>;

export default function FormLogin() {
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);

  const form = useForm<FormData>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log("data: ", data);

    const message: ChatCompletionMessage = {
      role: "user",
      content: data.message,
    };

    // PEGA AS MSG EM MOMERIA E ADD A ULTIMA NO ARRAY
    const messageInContext = [...messages, message];

    try {
      const response = await axios.post("/api/ai/conversation", {
        messages: messageInContext,
      });

      setMessages((prev) => [...prev, message, response.data]);

      console.log("response.data: ", response.data);

      form.reset();
    } catch (error) {
      console.log("error: ", error);
    }
  });

  return (
    <div className="flex flex-col gap-4 border p-6">
      <h1>Hunt Talent IA</h1>

      <Form {...form}>
        <form onSubmit={onSubmit} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite sua mensagem aqui"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-4 space-y-4 ">
        <div className="flex items-center justify-center">
          {form.formState.isSubmitting && (
            <BrainCircuit className="mt-6 h-20 w-20 animate-pulse" />
          )}
        </div>

        <div className="container flex flex-col-reverse gap-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="flex w-full items-start gap-4 rounded-lg border p-6"
            >
              <div>
                {msg.role === "assistant" && <BrainCircuit />}
                {msg.role === "user" && <User />}
              </div>

              <div>{msg.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
