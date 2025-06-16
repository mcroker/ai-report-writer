
"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Thermometer, StickyNote, CheckSquare } from 'lucide-react';
import { earlyLearningSkillGroups } from '@/app/earlyLearningSkillGroups';

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

      <Separator className="my-6" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center text-foreground">
            <CheckSquare className="mr-2 h-5 w-5 text-primary" />
            Early Learning Skill Progress (Toggle observed skills)
        </h3>
        {earlyLearningSkillGroups.map((group) => (
          <div key={group.title} className="space-y-3 p-4 border rounded-md shadow-sm bg-card/50">
            <h4 className="font-medium flex items-center text-foreground">
              {group.icon}
              {group.title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pl-2">
              {group.skills.map((skill) => (
                <FormField
                  key={skill.name}
                  control={control}
                  name={skill.name as any}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm flex items-center">
                          {skill.icon}
                          {skill.label}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label={skill.label}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
