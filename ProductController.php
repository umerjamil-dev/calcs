<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private function storageBaseUrl(): string
    {
        return rtrim(config('app.url'), '/') . '/test/public/storage/';
    }

    private function normalizeImagePath(string $url): string
    {
        $baseUrl = $this->storageBaseUrl();
        if (str_starts_with($url, $baseUrl)) {
            return substr($url, strlen($baseUrl));
        }
        return $url;
    }

    private function normalizeImagePaths(array $images): array
    {
        return array_values(array_map([$this, 'normalizeImagePath'], $images));
    }

    public function index()
    {
        $products = Product::latest('created_at')->get();

        return response()->json([
            'status'  => true,
            'message' => 'Products retrieved successfully.',
            'data'    => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'p_code'          => 'required|string|max:50|unique:products,p_code',
            'sku'             => 'nullable|string|max:50|unique:products,sku',
            'name'            => 'required|string|max:191',
            'slug'            => 'nullable|string|max:191|unique:products,slug',
            'brand_id'        => 'nullable|exists:brands,id',
            'category_id'     => 'nullable|exists:categories,id',
            'subcategory_id'  => 'nullable|exists:subcategories,id',
            'product_type_id' => 'nullable|exists:product_types,id',
            'engine_type_id'  => 'nullable|exists:engine_types,id',
            'pack_size'       => 'required|numeric',
            'price'           => 'required|numeric',
            'gallery_images'  => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $data = $request->except('gallery_images');

            if ($request->hasFile('gallery_images')) {
                $paths = [];
                foreach ($request->file('gallery_images') as $image) {
                    $paths[] = $image->store('products', 'public');
                }
                $data['gallery_images'] = $paths;
            }

            $product = Product::create($data);
            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Product created successfully.',
                'data'    => $product,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found.'], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Product retrieved successfully.',
            'data'    => $product,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Convert empty strings to null so nullable rules work correctly
        $nullableFields = [
            'p_code', 'sku', 'name', 'slug', 'brand_id', 'category_id',
            'subcategory_id', 'product_type_id', 'engine_type_id',
            'viscosity_grade', 'pack_size', 'pack_unit', 'price',
            'discount_price', 'stock_quantity', 'low_stock_threshold', 'description'
        ];

        foreach ($nullableFields as $field) {
            if ($request->has($field) && $request->input($field) === '') {
                $request->merge([$field => null]);
            }
        }

        $request->validate([
            'p_code'          => 'nullable|string|max:50|unique:products,p_code,' . $id,
            'sku'             => 'nullable|string|max:50|unique:products,sku,' . $id,
            'name'            => 'nullable|string|max:191',
            'slug'            => 'nullable|string|max:191|unique:products,slug,' . $id,
            'brand_id'        => 'nullable|exists:brands,id',
            'category_id'     => 'nullable|exists:categories,id',
            'subcategory_id'  => 'nullable|exists:subcategories,id',
            'product_type_id' => 'nullable|exists:product_types,id',
            'engine_type_id'  => 'nullable|exists:engine_types,id',
            'pack_size'       => 'nullable|numeric',
            'price'           => 'nullable|numeric',
            'gallery_images'  => 'nullable|array',
            'removed_images'  => 'nullable|array',
            'removed_images.*' => 'string',
        ]);

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found.'], 404);
        }

        DB::beginTransaction();
        try {
            $data = $request->except(['gallery_images', 'removed_images']);

            $hasImageChanges = false;
            $currentImages = $this->normalizeImagePaths($product->getOriginal('gallery_images') ?? []);
            if (!is_array($currentImages)) {
                $currentImages = json_decode($currentImages, true) ?: [];
            }

            // Remove selected existing images
            $removedImages = $this->normalizeImagePaths($request->input('removed_images', []));
            if (!empty($removedImages)) {
                foreach ($removedImages as $removedImage) {
                    if (in_array($removedImage, $currentImages)) {
                        Storage::disk('public')->delete($removedImage);
                        $currentImages = array_diff($currentImages, [$removedImage]);
                        $hasImageChanges = true;
                    }
                }
                $currentImages = array_values($currentImages);
            }

            // Add new images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $image) {
                    if (!$image->isValid() || !in_array($image->getMimeType(), ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])) {
                        DB::rollBack();
                        return response()->json(['status' => false, 'message' => 'Each gallery image must be a valid jpg, jpeg, png, or webp file.'], 422);
                    }
                    $currentImages[] = $image->store('products', 'public');
                }
                $hasImageChanges = true;
            }

            if ($hasImageChanges) {
                $data['gallery_images'] = $currentImages;
            }

            $product->update($data);
            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Product updated successfully.',
                'data'    => $product,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['status' => false, 'message' => 'Product not found.'], 404);
        }

        DB::beginTransaction();
        try {
            $product->delete();
            DB::commit();

            return response()->json([
                'status'  => true,
                'message' => 'Product deleted successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
