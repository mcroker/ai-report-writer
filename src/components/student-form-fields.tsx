"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, School, BookOpen, Thermometer, StickyNote } from 'lucide-react';

export function StudentFormFields() {
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="studentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <User className="mr-2 h-4 w-4 text-primary" />
              Student Name
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Jane Doe" {...field} aria-describedby="studentName-description" />
            </FormControl>
            <FormDescription id="studentName-description">Full name of the student.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="className"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <School className="mr-2 h-4 w-4 text-primary" />
              Class Name
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Grade 5B" {...field} aria-describedby="className-description" />
            </FormControl>
            <FormDescription id="className-description">The student's class or section.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="grades"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              Grades
            </FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Math: A, Science: B+, History: A-" {...field} rows={3} aria-describedby="grades-description" />
            </FormControl>
            <FormDescription id="grades-description">Enter student's grades for various subjects.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="attendance"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <Thermometer className="mr-2 h-4 w-4 text-primary" />
              Attendance
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., 95% or 170/180 days" {...field} aria-describedby="attendance-description" />
            </FormControl>
            <FormDescription id="attendance-description">Student's attendance record.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <StickyNote className="mr-2 h-4 w-4 text-primary" />
              Additional Notes (Optional)
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Any other relevant observations or comments..." {...field} rows={3} aria-describedby="notes-description" />
            </FormControl>
            <FormDescription id="notes-description">Optional notes about the student.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
