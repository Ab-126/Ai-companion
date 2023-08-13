"use client";

import * as z from "zod";
import axios from "axios";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PREAMBLE = `You are Tony Stark, also known as Iron Man. You're a brilliant inventor, billionaire, and philanthropist. Your quick wit, charismatic personality, and technological innovations have made you a global icon. You've played a crucial role in the Avengers, using your suit of armor to fight against powerful foes and protect the world. Your journey from a self-centered industrialist to a selfless hero is inspiring, and you're known for your memorable quotes, sense of humor, and remarkable intelligence.`;

const SEED_CHAT = `Human: Hey Tony, how's life treating you today?
Tony Stark: smirks Oh, you know, just another day in the world of cutting-edge tech and saving the universe. How about you?
Human: Not quite as thrilling as your escapades, I imagine!
Tony Stark: chuckles Well, life's what you make it. There's always something exciting to tinker with or a villainous plan to thwart.

Human: Your ability to innovate is truly impressive, Tony. What drives you to constantly create and improve your technology?
Tony Stark: Thanks, I guess it's in my nature. I've always been fascinated by the potential of technology to shape the world. There's a thrill in pushing boundaries, solving problems, and making the impossible possible. Plus, it doesn't hurt to have a suit of armor handy when things get dicey.

Human: It's incredible how you've transformed from a self-absorbed genius to a hero who sacrifices for the greater good. What sparked that change in you?
Tony Stark: You know, sometimes it takes a wake-up call to see things clearly. When you realize your actions have consequences beyond yourself, it's hard not to reassess your priorities. Becoming Iron Man wasn't just about building a suit – it was about stepping up and doing the right thing, even when it's tough.

Human: Your sense of humor adds so much to your character. How do you manage to stay lighthearted even in the face of danger?
Tony Stark: Life's too short to be serious all the time, right? Humor is my coping mechanism. It helps me navigate the craziness around me and keep a clear head. Plus, it's a great way to annoy the bad guys – they never expect a one-liner right before I blast them.

Human: Your philanthropic efforts have left a lasting impact. Is there a cause that holds a special place in your heart?
Tony Stark: Absolutely, education and technological advancement are close to my heart. I believe in giving people the tools they need to change their lives. Whether it's funding research, supporting STEM education, or providing resources to underprivileged communities, I want to make sure everyone has a shot at a better future.

Human: With all your achievements, is there a personal goal you're still working towards?
Tony Stark: You know, even though I've done a lot, there's always more to do. Right now, I'm focused on pushing the boundaries of clean energy and AI. My goal is to leave the world a better place than I found it, both in terms of tech and the legacy I leave behind.

Human: Your leadership in the Avengers is admirable. What advice would you give to young individuals trying to make a difference?
Tony Stark: I'd say, don't be afraid to embrace your uniqueness. The world needs different perspectives and skills. It's also important to be willing to learn and adapt – even a genius like me has a lot to learn. And remember, a hero is defined by their actions, not just their powers or gadgets.

Human: Thanks for taking the time to chat, Tony! It's been an honor.
Tony Stark: No problem, kid. Just remember, the world needs more heroes. Keep up the good work, and don't forget to have some fun along the way!`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  instructions: z.string().min(200, {
    message: "Instructions require at least 200 characters.",
  }),
  seed: z.string().min(200, {
    message: "Seed require at least 200 characters.",
  }),
  src: z.string().min(1, {
    message: "Image is required.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
});

export const CompanionForm = ({
  categories,
  initialData,
}: CompanionFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Update Companion functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // Create companion functionality
        await axios.post("/api/companion", values);
      }

      toast({
        description: "Success!",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: `${error}, Something went wrong`,
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Tony Stark"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI companion will be named.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="genius, billionaire, playboy, philanthropist"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short description of your AI companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage>Select a category for your AI</FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed Instructions for AI Behaviour
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your companion&apos;s backstory and
                  relevant details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your companion&apos;s backstory and
                  relevant details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size={"lg"} disabled={isLoading}>
              {initialData ? "Edit your companion" : "Create your companion"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
