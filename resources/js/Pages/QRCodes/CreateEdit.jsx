import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function QRCodesCreateEdit({ qrcode }) {
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);

    const { data, setData, post, patch, errors, reset, processing } = useForm({
        bank_name: qrcode?.bank_name || '',
        qr_image: null,
        active: qrcode?.active ?? 1,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setData('qr_image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!qrcode?.id) {
            post(route('qrcodes.store'), { forceFormData: true });
        } else {
            patch(route('qrcodes.update', qrcode.id), { forceFormData: true });
        }
    };

    const headWeb = qrcode?.id ? 'Edit QR Code' : 'Create QR Code';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'QR Codes', url: route('qrcodes.index') },
        { title: headWeb, url: '' },
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">{headWeb}</h3>
                            </div>
                            <form onSubmit={submit}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label className="text-uppercase small font-weight-bold">
                                                <span className="text-danger">*</span> Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.bank_name}
                                                onChange={(e) => setData('bank_name', e.target.value)}
                                                className={`form-control ${errors.bank_name && 'is-invalid'}`}
                                                placeholder="e.g., ABA, Wing, Khmer Bank"
                                            />
                                            <InputError message={errors.bank_name} />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label className="text-uppercase small font-weight-bold">Status</label>
                                            <select
                                                value={data.active}
                                                onChange={(e) => setData('active', e.target.value)}
                                                className={`form-control ${errors.active && 'is-invalid'}`}
                                            >
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            <InputError message={errors.active} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> QR Code Image
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className={`form-control-file ${errors.qr_image && 'is-invalid'}`}
                                            accept="image/*"
                                        />
                                        <InputError message={errors.qr_image} />

                                        {preview && (
                                            <div className="mt-3">
                                                <p className="text-sm font-weight-bold">Preview:</p>
                                                <img src={preview} alt="QR Preview" style={{ maxWidth: '200px', borderRadius: '4px' }} />
                                            </div>
                                        )}

                                        {qrcode?.qr_image && !preview && (
                                            <div className="mt-3">
                                                <p className="text-sm font-weight-bold">Current Image:</p>
                                                <img src={`/storage/${qrcode.qr_image}`} alt="Current QR" style={{ maxWidth: '200px', borderRadius: '4px' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-footer clearfix">
                                    <Link href={route('qrcodes.index')} className="btn btn-default mr-2">
                                        Cancel
                                    </Link>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? (qrcode?.id ? 'Updating...' : 'Saving...') : (qrcode?.id ? 'Update' : 'Save')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
