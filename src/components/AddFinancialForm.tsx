
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CreditCard, Wallet, Landmark } from 'lucide-react';

const formSchema = z.object({
  type: z.enum(['card', 'upi', 'account']),
  name: z.string().min(1, 'Name is required'),
  
  // Credit card specific fields
  cardNumber: z.string().optional()
    .refine(val => !val || /^(\d{4}\s?){3}\d{4}$/.test(val.replace(/\s/g, '')), {
      message: "Card number must be 16 digits",
    }),
  lastDigits: z.string().optional(),
  expiryDate: z.string().optional()
    .refine(val => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
      message: "Expiry date must be in MM/YY format and month must be between 01-12",
    }),
  cvv: z.string().optional()
    .refine(val => !val || /^\d{3,4}$/.test(val), {
      message: "CVV must be 3 or 4 digits",
    }),
  
  // UPI specific fields
  upiId: z.string().optional(),
  
  // Bank account specific fields
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  ifsc: z.string().optional(), // Added IFSC code for bank accounts
  
  // Optional notes field
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFinancialFormProps {
  onClose: () => void;
  onSuccess: (newItem: any) => void;
}

export const AddFinancialForm: React.FC<AddFinancialFormProps> = ({ onClose, onSuccess }) => {
  const [selectedType, setSelectedType] = useState<'card' | 'upi' | 'account'>('card');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'card',
      name: '',
      cardNumber: '',
      lastDigits: '',
      expiryDate: '',
      cvv: '',
      upiId: '',
      accountNumber: '',
      bankName: '',
      ifsc: '',
      notes: '',
    },
  });
  
  const onSubmit = (values: FormValues) => {
    // If card number is provided, extract last 4 digits
    if (values.cardNumber) {
      values.lastDigits = values.cardNumber.replace(/\s/g, '').slice(-4);
    }
    
    // Generate a unique ID for the new item
    const newItem = {
      ...values,
      id: crypto.randomUUID(), // Add a unique ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, this would save to secure storage
    console.log('Saving financial info:', newItem);
    toast.success(`${values.name} added successfully`);
    
    // Pass the new item to the parent component
    onSuccess(newItem);
    onClose();
  };
  
  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'card' | 'upi' | 'account');
    form.setValue('type', value as 'card' | 'upi' | 'account');
  };

  // Format card number with spaces after every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formattedValue = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formattedValue.substring(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date to automatically add / after month
  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length >= 2) {
      const month = parseInt(cleanValue.substring(0, 2));
      
      // Ensure month is between 01-12
      if (month >= 1 && month <= 12) {
        return cleanValue.length > 2
          ? `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`
          : `${cleanValue.substring(0, 2)}/`;
      } else if (month > 12) {
        // If user enters month > 12, convert to 12
        return cleanValue.length > 2
          ? `12/${cleanValue.substring(2, 4)}`
          : `12/`;
      } else {
        // Ensure single-digit months are padded with 0
        const paddedMonth = month.toString().padStart(2, '0');
        return cleanValue.length > 2
          ? `${paddedMonth}/${cleanValue.substring(2, 4)}`
          : `${paddedMonth}/`;
      }
    }
    
    return cleanValue;
  };
  
  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTypeChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Credit/Debit Card</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        <span>UPI ID</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="account">
                      <div className="flex items-center">
                        <Landmark className="h-4 w-4 mr-2" />
                        <span>Bank Account</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={
                      selectedType === 'card' 
                        ? "Card nickname" 
                        : selectedType === 'upi' 
                          ? "UPI provider name" 
                          : "Account nickname"
                    } 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedType === 'card' && (
            <>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        maxLength={19}
                        value={field.value}
                        onChange={(e) => {
                          const formattedValue = formatCardNumber(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM/YY" 
                        maxLength={5}
                        value={field.value}
                        onChange={(e) => {
                          const formattedValue = formatExpiryDate(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        maxLength={4}
                        type="password"
                        onChange={(e) => {
                          // Only allow digits
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            field.onChange(value);
                          }
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {selectedType === 'upi' && (
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username@upi" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {selectedType === 'account' && (
            <>
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bank name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Full account number" 
                        maxLength={30}
                        type="password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="IFSC Code" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Additional information" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
