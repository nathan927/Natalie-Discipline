import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Repeat, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stickers, type InsertTask } from "@shared/schema";
import { StickerIcon } from "./sticker-icon";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: InsertTask & { stickerId?: string }) => void;
  selectedDate?: string;
}

const presetDurations = [15, 30, 45, 60];

const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  scheduledTime: z.string().optional(),
  durationMinutes: z.number().min(1).optional(),
  recurring: z.enum(["daily", "weekly", "none"]).default("none"),
  stickerId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddTaskModal({ isOpen, onClose, onAdd, selectedDate }: AddTaskModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      scheduledTime: "",
      durationMinutes: 30,
      recurring: "none",
      stickerId: undefined,
    },
  });

  const magicalStickers = stickers.filter(s => s.category === "magical-girls").slice(0, 5);

  const handleSubmit = (values: FormValues) => {
    onAdd({
      title: values.title.trim(),
      scheduledTime: values.scheduledTime || undefined,
      durationMinutes: values.durationMinutes,
      recurring: values.recurring,
      stickerId: values.stickerId,
    });

    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={handleClose}
            data-testid="modal-backdrop"
          />
          <motion.div
            className="relative bg-card rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl border border-border"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            data-testid="add-task-modal"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground" data-testid="modal-title">New Task</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        What do you need to do?
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Practice piano"
                          className="h-12 text-lg rounded-xl"
                          autoFocus
                          data-testid="input-task-title"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="h-12 rounded-xl"
                            data-testid="input-task-time"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurring"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          Repeat
                        </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl" data-testid="select-recurring">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none" data-testid="option-none">No repeat</SelectItem>
                            <SelectItem value="daily" data-testid="option-daily">Daily</SelectItem>
                            <SelectItem value="weekly" data-testid="option-weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Duration (minutes)</FormLabel>
                      <div className="flex gap-2">
                        {presetDurations.map((d) => (
                          <Button
                            key={d}
                            type="button"
                            variant={field.value === d ? "default" : "secondary"}
                            className="flex-1 h-12 rounded-xl font-semibold"
                            onClick={() => field.onChange(d)}
                            data-testid={`button-duration-${d}`}
                          >
                            {d}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stickerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Reward Sticker
                      </FormLabel>
                      <div className="flex gap-3 justify-center py-2">
                        {magicalStickers.map((sticker) => (
                          <motion.div
                            key={sticker.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => field.onChange(sticker.id)}
                            className={`p-2 rounded-xl cursor-pointer transition-all ${
                              field.value === sticker.id
                                ? "ring-2 ring-primary bg-primary/10"
                                : "hover:bg-muted"
                            }`}
                            data-testid={`sticker-option-${sticker.id}`}
                          >
                            <StickerIcon sticker={sticker} unlocked={true} size="md" />
                          </motion.div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold rounded-xl"
                  disabled={!form.formState.isValid}
                  data-testid="button-create-task"
                >
                  Create Task
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
