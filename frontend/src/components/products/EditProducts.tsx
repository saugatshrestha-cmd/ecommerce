import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategory";
import { useProduct, useUpdateProduct } from "@/hooks/useProduct";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProductSchema } from "@/validations/productValidation";

type EditProductInput = z.infer<typeof updateProductSchema>;

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading: isProductLoading } = useProduct(id!);
    const { data: categories = [] } = useCategories();
    const mutation = useUpdateProduct();

    const [images, setImages] = useState<FileList | null>(null);
    const [bannerImage, setBannerImage] = useState<File | null>(null);

    const form = useForm<EditProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
        name: "",
        description: "",
        price: 1,
        quantity: 1,
        categoryId: "",
        bannerTitle: "",
        bannerDescription: "",
    },
    });

    useEffect(() => {
    if (product) {
    form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.categoryId._id,
        bannerTitle: product.bannerTitle ?? "",
        bannerDescription: product.bannerDescription ?? "",
    });
    }
}, [product, form]);


    const onSubmit = (values: EditProductInput) => {
    if (!id) return;

    const formData = new FormData();

    if (values.name) formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    if (values.price !== undefined) formData.append("price", values.price.toString());
    if (values.quantity !== undefined) formData.append("quantity", values.quantity.toString());
    if (values.categoryId) formData.append("categoryId", values.categoryId);

    if (images && images.length > 0) {
    Array.from(images).forEach((image) => {
        if (image) {
        formData.append("newFiles", image);
        }
    });
    }

    if (product?.bannerProduct) {
        if (values.bannerTitle) formData.append("bannerTitle", values.bannerTitle);
        if (values.bannerDescription) formData.append("bannerDescription", values.bannerDescription);
        if (bannerImage) formData.append("bannerImage", bannerImage);
    }

    mutation.mutate(
    { id, data: formData },
    {
        onSuccess: () => {
        toast.success("Product updated successfully");
        navigate("/seller/products");
        },
        onError: () => {
        toast.error("Failed to update product");
        },
    }
    );
};

    if (isProductLoading) {
    return (
        <div className="flex justify-center items-center h-60">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading product...</span>
        </div>
    );
    }

    return (
    <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
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
                        value={field.value ?? ""}
                        onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : parseFloat(value));
                        }}
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
                        value={field.value ?? ""}
                        onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? undefined : parseInt(value));
                        }}
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

            <FormItem>
            <FormLabel>Replace Product Images</FormLabel>
            <FormControl>
                <Input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setImages(e.target.files)}
                />
            </FormControl>
            <FormMessage />
            </FormItem>

            {product?.bannerProduct && (
            <>
                <FormField
                control={form.control}
                name="bannerTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Banner Title</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="bannerDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Banner Description</FormLabel>
                    <FormControl>
                        <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormItem>
                <FormLabel>Banner Image</FormLabel>
                <FormControl>
                    <Input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setBannerImage(file);
                    }}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            </>
            )}

            <Button type="submit" disabled={mutation.isPending} className="bg-[#E5A469] hover:bg-[#DF8D44]">
            {mutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {mutation.isPending ? "Updating..." : "Update Product"}
            </Button>
        </form>
        </Form>
    </div>
    );
};

export default EditProductPage;
