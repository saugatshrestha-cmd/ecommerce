import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategorySchema } from "@/validations/categoryValidation";
import type { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryById, useUpdateCategory } from "@/hooks/useCategory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

const EditCategory = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: category, isLoading } = useCategoryById(id ?? "");
    const updateMutation = useUpdateCategory();

    const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
        name: "",
        description: "",
    },
    values: category ?? {
        name: "",
        description: "",
    },
    });

    const onSubmit = (values: UpdateCategoryInput) => {
    if (!id) return;
    updateMutation.mutate(
        { id, data: values },
        {
        onSuccess: () => {
            toast.success("Category updated successfully");
            navigate("/admin/category");
        },
        onError: () => {
            toast.error("Failed to update category");
        },
        }
    );
    };

    if (isLoading) return <p className="p-4">Loading category...</p>;
    if (!category) return <p className="p-4">Category not found</p>;

    return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6">Edit Category</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                    <Input placeholder="Category name" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Enter category description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" disabled={updateMutation.isPending} className="bg-[#E5A469] hover:bg-[#DF8D44]">
                {updateMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
        </form>
        </Form>
    </div>
    );
};

export default EditCategory;
