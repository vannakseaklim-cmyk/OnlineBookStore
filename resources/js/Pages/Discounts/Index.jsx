import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Head, Link } from '@inertiajs/react';

export default function Index({ discounts }) {

    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: 'Discount List', url: '' },
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header="Discount List" links={linksBreadcrumb} />}>
            <Head title="Discount List" />

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-outline card-info">

                        <div className="card-header">
                            <h3 className="card-title">Discount List</h3>
                            <div className="card-tools">
                                <Link
                                    href={route('discounts.create')}
                                    className="btn btn-primary btn-sm"
                                >
                                    Create Discount
                                </Link>
                            </div>
                        </div>

                        <div className="card-body table-responsive p-0">
                            <table className="table table-hover text-nowrap">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Percent</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discounts.data.map((discount) => (
                                        <tr key={discount.id}>
                                            <td>{discount.id}</td>
                                            <td>{discount.name}</td>
                                            <td>{discount.discount_percent}%</td>
                                            <td>{discount.start_date}</td>
                                            <td>{discount.end_date}</td>
                                            <td>
                                                {discount.active ? (
                                                    <span className="badge badge-success">Active</span>
                                                ) : (
                                                    <span className="badge badge-danger">Inactive</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}