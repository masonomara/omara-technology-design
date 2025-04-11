'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { sendMail } from '@/app/lib/send-mail';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Please Enter Your Name' }),
  email: z.string().email({ message: 'Please Enter a Valid Email Address' }),
  message: z
    .string()
    .min(10, { message: 'Please make sure your message is at least 10 characters long.' }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  
  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    const mailText = `Name: ${values.name}\n  Email: ${values.email}\nMessage: ${values.message}`;
    const response = await sendMail({
      email: values.email,
      subject: 'New Contact Us Form',
      text: mailText,
    });
    
    if (response?.messageId) {
      toast.success('Application Submitted Successfully.');
    } else {
      toast.error('Failed To send application.');
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 items-center p-4 lg:p-6">
      <div className="col-span-3 flex flex-col gap-4 lg:col-span-3 lg:gap-6">
        <h2 className="lg:text-xl">Enter Your Good Name Here:</h2>
        <div>
          <input 
            placeholder="John Doe" 
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p>{form.formState.errors.name.message}</p>
          )}
        </div>
        
        <h2 className="lg:text-xl">Enter Your Email Address:</h2>
        <div>
          <input 
            placeholder="john@example.com" 
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p>{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <h2 className="lg:text-xl">Enter Your Message Here:</h2>
        <div>
          <textarea
            placeholder="My question is which framework do you prefer to use?"
            {...form.register("message")}
          />
          {form.formState.errors.message && (
            <p>{form.formState.errors.message.message}</p>
          )}
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending.....' : 'Send'}
        </button>
      </div>
    </form>
  );
}