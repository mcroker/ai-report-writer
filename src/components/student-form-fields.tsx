
"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, School, BookOpen, Thermometer, StickyNote, Target, Ear, MessageCircle, Brain, ScanText, PenLine, Bike, Hand, ShieldCheck, UserCheck, Users, Landmark, Globe, Leaf, Paintbrush, Sparkles, CheckSquare } from 'lucide-react';

const earlyLearningSkillGroups = [
  {
    title: "Communication and Language",
    icon: <MessageCircle className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "listeningAttentionUnderstanding", label: "Listening, Attention and Understanding", icon: <Ear className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "speaking", label: "Speaking", icon: <MessageCircle className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "comprehension", label: "Comprehension", icon: <Brain className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "wordReading", label: "Word Reading", icon: <ScanText className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "writing", label: "Writing", icon: <PenLine className="mr-2 h-4 w-4 text-primary/80" /> },
    ]
  },
  {
    title: "Physical Development",
    icon: <Bike className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "grossMotorSkills", label: "Gross Motor Skills", icon: <Bike className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "fineMotorSkills", label: "Fine Motor Skills", icon: <Hand className="mr-2 h-4 w-4 text-primary/80" /> },
    ]
  },
  {
    title: "Personal, Social and Emotional Development",
    icon: <Users className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "selfRegulation", label: "Self-regulation", icon: <ShieldCheck className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "managingSelf", label: "Managing Self", icon: <UserCheck className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "buildingRelationships", label: "Building Relationships", icon: <Users className="mr-2 h-4 w-4 text-primary/80" /> },
    ]
  },
  {
    title: "Understanding the World",
    icon: <Globe className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "pastAndPresent", label: "Past and Present", icon: <Landmark className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "peopleCultureCommunities", label: "People, Culture and Communities", icon: <Users className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "theNaturalWorld", label: "The Natural World", icon: <Leaf className="mr-2 h-4 w-4 text-primary/80" /> },
    ]
  },
  {
    title: "Expressive Arts and Design",
    icon: <Sparkles className="mr-2 h-5 w-5 text-primary" />,
    skills: [
      { name: "creatingWithMaterials", label: "Creating with Materials", icon: <Paintbrush className="mr-2 h-4 w-4 text-primary/80" /> },
      { name: "beingImaginativeExpressive", label: "Being Imaginative and Expressive", icon: <Sparkles className="mr-2 h-4 w-4 text-primary/80" /> },
    ]
  }
];


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
      <FormField
        control={control}
        name="earlyLearningGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center text-foreground">
              <Target className="mr-2 h-4 w-4 text-primary" />
              Early Learning Goals (Optional Text Input)
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Describe early learning goals or targets for the student..." {...field} rows={3} aria-describedby="earlyLearningGoals-description" />
            </FormControl>
            <FormDescription id="earlyLearningGoals-description">Optional broad early learning goals for the student.</FormDescription>
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
