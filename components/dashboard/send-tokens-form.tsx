"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema with zod
const sendTokensSchema = z.object({
  recipient: z.string()
    .min(10, "Address must be at least 10 characters")
    .regex(/^0x[a-fA-F0-9]+$/, "Must be a valid blockchain address"),
  token: z.string({
    required_error: "Please select a token to send",
  }),
  amount: z.string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Amount must be a valid number",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  memo: z.string().optional(),
});

// Define the form value type
type SendTokensFormValues = z.infer<typeof sendTokensSchema>;

export function SendTokensForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [transactionMessage, setTransactionMessage] = useState("");
  
  // Initialize the form
  const form = useForm<SendTokensFormValues>({
    resolver: zodResolver(sendTokensSchema),
    defaultValues: {
      recipient: "",
      token: "APT",
      amount: "",
      memo: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: SendTokensFormValues) {
    setIsSubmitting(true);
    setTransactionStatus('idle');
    
    try {
      console.log("Sending tokens:", values);
      
      // In a real application, this would call your backend API or directly use the Move Agent Kit
      // await moveAgent.transferTokens(values.recipient, parseFloat(values.amount));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setTransactionStatus('success');
      setTransactionMessage("Transaction submitted successfully! Transaction hash: 0xabc123...");
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error sending tokens:", error);
      setTransactionStatus('error');
      setTransactionMessage("Failed to send tokens. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {transactionStatus === 'success' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {transactionMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {transactionStatus === 'error' && (
        <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {transactionMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormDescription>
                  Enter the Aptos address of the recipient
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APT">APT</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="wETH">wETH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memo (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Payment for..." {...field} />
                </FormControl>
                <FormDescription>
                  Add a note about this transaction
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Tokens"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}