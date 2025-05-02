
import React, { useState } from 'react';
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
  lastDigits: z.string().optional(),
  expiryDate: z.string().optional(),
  
  // UPI specific fields
  upiId: z.string().optional(),
  
  // Bank account specific fields
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  
  // Optional notes field
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFinancialFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddFinancialForm: React.FC<AddFinancialFormProps> = ({ onClose, onSuccess }) => {
  const [selectedType, setSelectedType] = useState<'card' | 'upi' | 'account'>('card');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'card',
      name: '',
      lastDigits: '',
      expiryDate: '',
      upiId: '',
      accountNumber: '',
      bankName: '',
      notes: '',
    },
  });
  
  const onSubmit = (values: FormValues) => {
    // In a real app, this would save to secure storage
    console.log('Saving financial info:', values);
    toast.success(`${values.name} added successfully`);
    onSuccess();
    onClose();
  };
  
  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'card' | 'upi' | 'account');
    form.setValue('type', value as 'card' | 'upi' | 'account');
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
                name="lastDigits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last 4 Digits</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234" 
                        maxLength={4}
                        {...field} 
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
                        {...field} 
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
                    <FormLabel>Last 4 Digits of Account Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234" 
                        maxLength={4}
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
