import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function DiscountsCreateEdit({ datas }) {

    const { data, setData, post, errors, processing } =
        useForm({
            name: datas?.name || '',
            discount_percent: datas?.discount_percent || '',
            start_date: datas?.start_date || '',
            end_date: datas?.end_date || '',
            active: datas?.active ?? 1,
            _method: datas?.id ? 'PATCH' : 'POST',
        });

    const submit = (e) => {
        e.preventDefault();

        if (!datas?.id) {
            post(route('discounts.store'));
        } else {
            post(route('discounts.update', datas.id));
        }
    };

    const headWeb = datas?.id ? 'Edit Discount' : 'Create Discount';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'Discount List', url: route('discounts.index') },
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

                                    {/* Discount Name */}
                                    <div className="form-group col-md-6">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Discount Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`form-control ${errors.name && 'is-invalid'}`}
                                            placeholder="Example: New Year 20%"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Discount Percent */}
                                    <div className="form-group col-md-6">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Discount Percent (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.discount_percent}
                                            onChange={(e) => setData('discount_percent', e.target.value)}
                                            className={`form-control ${errors.discount_percent && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.discount_percent} />
                                    </div>

                                </div>

                                <div className="row">

                                    {/* Start Date */}
                                    <div className="form-group col-md-6">
                                        <label className="text-uppercase small font-weight-bold">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className={`form-control ${errors.start_date && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.start_date} />
                                    </div>

                                    {/* End Date */}
                                    <div className="form-group col-md-6">
                                        <label className="text-uppercase small font-weight-bold">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className={`form-control ${errors.end_date && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.end_date} />
                                    </div>

                                </div>

                                {/* Status */}
                                <div className="form-group col-md-4 pl-0">
                                    <label className="text-uppercase small font-weight-bold">
                                        <span className="text-danger">*</span> Status
                                    </label>
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

                            <div className="card-footer bg-light text-right">
                                <Link href={route('discounts.index')} className="btn btn-default mr-2">
                                    Cancel
                                </Link>

                                <PrimaryButton
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Processing...'
                                        : (datas?.id ? 'Update Discount' : 'Save Discount')}
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}