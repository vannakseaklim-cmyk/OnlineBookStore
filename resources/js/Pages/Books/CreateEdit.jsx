import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function BooksCreateEdit({ datas, categories, discounts = [] }) {
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);

    const { data, setData, post, errors, reset, processing } =
        useForm({
            title: datas?.title || '',
            pages: datas?.pages || '',
            author: datas?.author || '', 
            description: datas?.description || '',
            category_id: datas?.category_id || '',
            price: datas?.price || '',
            discount_id: datas?.discount_id || '',
            stock: datas?.stock || 0,
            cover_image: null, 
            _method: datas?.id ? 'PATCH' : 'POST', 
        });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setData('cover_image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!datas?.id) {
            post(route('books.store'), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('books.update', datas.id), {
                forceFormData: true,
            });
        }
    };

    const headWeb = datas?.id ? 'Edit Book' : 'Create Book';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'Book List', url: route('books.index') },
        { title: headWeb, url: '' },
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-outline card-info">
                        <div className="card-header">
                            <h3 className="card-title">{headWeb}</h3>
                        </div>
                        <form onSubmit={submit}>
                            <div className="card-body">
                                <div className="row">
                                   
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Book Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className={`form-control ${errors.title && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Book Pages
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pages}
                                            onChange={(e) => setData('pages', e.target.value)}
                                            className={`form-control ${errors.pages && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.pages} />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Author
                                        </label>
                                        <input
                                            type="text"
                                            value={data.author}
                                            onChange={(e) => setData('author', e.target.value)}
                                            className={`form-control ${errors.author && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.author} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="text-uppercase small font-weight-bold">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={`form-control ${errors.description && 'is-invalid'}`}
                                        rows={4}
                                        placeholder="Enter book description"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="row">
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Category
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className={`form-control ${errors.category_id && 'is-invalid'}`}
                                        >
                                            <option value="">Select Category</option>
                                            {categories
                                                .filter(cat => cat.status === 1)
                                                .map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                        </select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Price
                                        </label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className={`form-control ${errors.price && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">Discount</label>
                                        <select
                                            value={data.discount_id || ''}
                                            onChange={(e) => setData('discount_id', e.target.value)}
                                            className="form-control"
                                        >
                                            <option value="">No Discount</option>
                                            {discounts.map((discount) => (
                                                <option key={discount.id} value={discount.id}>
                                                    {discount.discount_percent}% ({discount.start_date} - {discount.end_date})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Stock
                                        </label>
                                        <input
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            className={`form-control ${errors.stock && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.stock} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="text-uppercase small font-weight-bold">Cover Image</label>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className={`form-control-file ${errors.cover_image && 'is-invalid'}`}
                                        accept="image/*"
                                    />
                                    {datas?.cover_image && !data.cover_image && (
                                        <div className="mt-2">
                                            <small>Current Cover:</small><br/>
                                            <img src={`/storage/${datas.cover_image}`} width="80" className="img-thumbnail" />
                                        </div>
                                    )}
                                    {preview && (
                                        <div className="mt-4">
                                            <p className="text-sm font-weight-bold mb-2">New Cover Preview:</p>
                                            <img 
                                                src={preview} 
                                                alt="Cover image preview" 
                                                className="border-2 border-info" 
                                                style={{width: '150px', height: '200px', objectFit: 'cover', borderRadius: '4px'}}
                                            />
                                            {image && <p className="text-xs text-muted mt-2">{image.name}</p>}
                                        </div>
                                    )}
                                    <InputError message={errors.cover_image} />
                                </div>
                            </div>

                            <div className="card-footer bg-light text-right">
                                <Link href={route('books.index')} className="btn btn-default mr-2">Cancel</Link>
                                <PrimaryButton type="submit" className='btn btn-primary' disabled={processing}>
                                    {processing ? 'Processing...' : (datas?.id ? 'Update Book' : 'Save Book')}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
