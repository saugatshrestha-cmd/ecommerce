import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategory";
import { useCreateProduct } from "@/hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { productSchema } from "@/validations/productValidation";

type CreateProductInput = z.infer<typeof productSchema>;

const AddProductPage = () => {
    const navigate = useNavigate();
    const { data: categories = [] } = useCategories();
    const mutation = useCreateProduct();
    const [images, setImages] = useState<FileList | null>(null);

    const form = useForm<CreateProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
        name: "",
        description: "",
        price: undefined,
        quantity: undefined,
        categoryId: "",
        images: undefined,
    },
    });

    const onSubmit = (values: CreateProductInput) => {

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("quantity", values.quantity.toString());
    formData.append("categoryId", values.categoryId);

    if (images && images.length > 0) {
    Array.from(images).forEach((image) => {
        formData.append("images", image);
    });
    }

    mutation.mutate(formData, {
        onSuccess: () => {
            form.reset();
            toast.success("Product added successfully");
            navigate("/seller/products");
        },
        onError: () => {
            toast.error("Failed to add product");
        },
    });
    };

    return (
    <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input placeholder="Enter product name" {...field} />
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
                    <Textarea placeholder="Enter a short product description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                    <Input
                        type="number"
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="no-spinner"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                    <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="no-spinner"
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <select {...field} className="border rounded-md p-2 w-full">
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                    </select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="images"
            render={() => (
                <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    multiple
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                        const files = e.target.files;
                        setImages(files);
                        form.setValue("images", files, { shouldValidate: true });
                    }}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" disabled={mutation.isPending} className="bg-[#E5A469] hover:bg-[#DF8D44]">
                {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mutation.isPending ? "Saving..." : "Create Product"}
            </Button>
        </form>
        </Form>
    </div>
    );
};

export default AddProductPage;
