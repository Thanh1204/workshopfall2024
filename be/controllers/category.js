import Category from "../models/category";
import { StatusCodes } from "http-status-codes";

// Tạo một danh mục mới
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
        if (error.code === 11000) {
            // Mã lỗi cho trùng lặp key
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Category title must be unique" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }
};

// Lấy tất cả các danh mục với phân trang và quan hệ
export const getCategories = async (req, res) => {
    try {
        const { _page = 1, _limit = 10, _expand } = req.query;
        const options = {
            page: parseInt(_page, 10),
            limit: parseInt(_limit, 10),
        };

        const result = await Category.paginate({}, options);
        const { docs, ...paginationData } = result;

        if (_expand === "products") {
            const categoriesWithProducts = await Promise.all(
                docs.map(async (category) => {
                    const products = await Product.find({ category: category._id });
                    return { ...category.toObject(), products };
                })
            );
            return res.status(StatusCodes.OK).json({
                categories: categoriesWithProducts,
                ...paginationData,
            });
        }

        return res.status(StatusCodes.OK).json({
            categories: docs,
            ...paginationData,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Lấy một danh mục theo ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
        }
        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Cập nhật một danh mục theo ID
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
        }
        res.status(StatusCodes.OK).json(category);
    } catch (error) {
        if (error.code === 11000) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Category title must be unique" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
    }
};

// Xóa một danh mục theo ID
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Category not found" });
        }
        res.status(StatusCodes.NO_CONTENT).send(); // Xóa thành công nhưng không trả về dữ liệu
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
