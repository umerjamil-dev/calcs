<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'p_code',
        'sku',
        'name',
        'slug',
        'brand_id',
        'category_id',
        'subcategory_id',
        'product_type_id',
        'engine_type_id',
        'viscosity_grade',
        'pack_size',
        'pack_unit',
        'price',
        'discount_price',
        'stock_quantity',
        'low_stock_threshold',
        'description',
        'gallery_images',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
        ];
    }

    public function getGalleryImagesAttribute($value)
    {
        if (!$value) return [];

        $images = json_decode($value, true);
        $baseUrl = rtrim(config('app.url'), '/') . '/test/public/storage/';

        return array_map(function ($image) use ($baseUrl) {
            // If already a full URL, return as-is
            if (filter_var($image, FILTER_VALIDATE_URL)) {
                return $image;
            }
            // If it starts with storage base path, return full URL
            if (str_starts_with($image, $baseUrl)) {
                return $image;
            }
            return url('storage/' . $image);
        }, $images);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }

    public function engineType()
    {
        return $this->belongsTo(EngineType::class);
    }
}
