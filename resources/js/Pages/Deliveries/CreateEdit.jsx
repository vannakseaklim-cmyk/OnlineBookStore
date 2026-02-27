import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function DeliveriesCreateEdit({ delivery }) {
    const { data, setData, post, patch, errors, reset, processing } = useForm({
        location: delivery?.location || '',
        cost: delivery?.cost || '',
        active: delivery?.active ?? 1,
    });

    const submit = (e) => {
        e.preventDefault();
        if (!delivery?.id) {
            post(route('deliveries.store'), { preserveState: true, onFinish: () => reset() });
        } else {
            patch(route('deliveries.update', delivery.id), { preserveState: true, onFinish: () => reset() });
        }
    };

    const headWeb = delivery?.id ? 'Edit Delivery' : 'Create Delivery';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'Delivery List', url: route('deliveries.index') },
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
                                <h3 className="card-title">Register Delivery Management</h3>
                            </div>

                            <form onSubmit={submit}>
                                <div className="card-body">

                                    <div className="form-group">
                                        <InputLabel htmlFor="location" value="Location *" />
                                        <TextInput
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className={`form-control ${errors.location && 'is-invalid'}`}
                                            placeholder="Example: Phnom Penh"
                                        />
                                        <InputError message={errors.location} className="mt-2" />
                                    </div>

                                    <div className="form-group">
                                        <InputLabel htmlFor="cost" value="Delivery Cost *" />
                                        <TextInput
                                            id="cost"
                                            type="number"
                                            step="0.01"
                                            value={data.cost}
                                            onChange={(e) => setData('cost', e.target.value)}
                                            className={`form-control ${errors.cost && 'is-invalid'}`}
                                            placeholder="Example: 2.00"
                                        />
                                        <InputError message={errors.cost} className="mt-2" />
                                    </div>


                                </div>

                                <div className="card-footer clearfix text-right">
                                    <Link href={route('deliveries.index')} className="btn btn-default mr-2">
                                        Cancel
                                    </Link>
                                    <PrimaryButton type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? (delivery?.id ? 'Updating...' : 'Saving...') : (delivery?.id ? 'Update' : 'Save')}
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