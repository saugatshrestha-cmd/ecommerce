import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/validations/categoryValidation";
import { z } from "zod";
import { useCreateCategory } from "@/hooks/useCategory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

type CreateCategoryInput = z.infer<typeof categorySchema>;

const NewCategory = () => {
    const navigate = useNavigate();
    const mutation = useCreateCategory();

    const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
        name: "",
        description: "",
    },
    });

    const createCategoryMutation = useCreateCategory();

    const onSubmit = (values: z.infer<typeof categorySchema>) => {
    createCategoryMutation.mutate(values, {
        onSuccess: () => {
        form.reset();
        navigate("/admin/category"); 
        },
    });
    };

    return (
    <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                    <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Enter a short category description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={mutation.isPending} className="bg-[#E5A469] hover:bg-[#DF8D44]">
            {mutation.isPending ? "Saving..." : "Create Category"}
            </Button>
        </form>
        </Form>
    </div>
    );
};

export default NewCategory;
