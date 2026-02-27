import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CouponCreateEdit({ datas }) {

    const { data, setData, post, errors, reset, processing } =
        useForm({
            code: datas?.code || '',
            type: datas?.type || 'percent',
            value: datas?.value || '',
            minimum_amount: datas?.minimum_amount || 0,
            start_date: datas?.start_date || '',
            end_date: datas?.end_date || '',
            active: datas?.active ?? true,
            _method: datas?.id ? 'PATCH' : 'POST',
        });

    const submit = (e) => {
        e.preventDefault();

        if (!datas?.id) {
            post(route('coupons.store'), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('coupons.update', datas.id));
        }
    };

    const headWeb = datas?.id ? 'Edit Coupon' : 'Create Coupon';

    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'Coupon List', url: route('coupons.index') },
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

                                    {/* Coupon Code */}
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Coupon Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            className={`form-control ${errors.code && 'is-invalid'}`}
                                            placeholder="EX: VIP10"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    {/* Type */}
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Type
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className={`form-control ${errors.type && 'is-invalid'}`}
                                        >
                                            <option value="percent">Percent (%)</option>
                                            <option value="fixed">Fixed ($)</option>
                                        </select>
                                        <InputError message={errors.type} />
                                    </div>

                                    {/* Value */}
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.value}
                                            onChange={(e) => setData('value', e.target.value)}
                                            className={`form-control ${errors.value && 'is-invalid'}`}
                                            placeholder={data.type === 'percent' ? "Enter %" : "Enter $ amount"}
                                        />
                                        <InputError message={errors.value} />
                                    </div>

                                </div>

                                <div className="row">

                                    {/* Minimum Amount */}
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            Minimum Order Amount ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.minimum_amount}
                                            onChange={(e) => setData('minimum_amount', e.target.value)}
                                            className={`form-control ${errors.minimum_amount && 'is-invalid'}`}
                                        />
                                        <InputError message={errors.minimum_amount} />
                                    </div>

                                    {/* Start Date */}
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> Start Date
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
                                    <div className="form-group col-md-4">
                                        <label className="text-uppercase small font-weight-bold">
                                            <span className="text-danger">*</span> End Date
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

                                {/* Active */}
                                <div className="form-group">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={data.active}
                                            onChange={(e) => setData('active', e.target.checked)}
                                        />
                                        <label className="form-check-label">
                                            Active Coupon
                                        </label>
                                    </div>
                                </div>

                            </div>

                            <div className="card-footer bg-light text-right">
                                <Link href={route('coupons.index')} className="btn btn-default mr-2">
                                    Cancel
                                </Link>

                                <PrimaryButton type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing
                                        ? 'Processing...'
                                        : (datas?.id ? 'Update Coupon' : 'Save Coupon')}
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}