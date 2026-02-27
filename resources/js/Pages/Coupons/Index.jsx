import Breadcrumb from '@/Components/Breadcrumb';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

export default function CouponsPage({ couponData }) {
    const datasList = couponData.data;
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({});

    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, clearErrors } =
        useForm({
            id: '',
            code: ''
        });

    const confirmDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id);
        setDeleteData('code', data.code);
        setConfirmingDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setDataEdit({});
        clearErrors();
        reset();
    };

    const deleteRow = (e) => {
        e.preventDefault();
        destroy(route('coupons.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: reset,
        });
    };

    const headWeb = 'Coupon List';

    const linksBreadcrumb = [
        {
            title: 'Create',
            type: 'button',
            url: route('coupons.create'),
            className: 'btn btn-primary btn-sm'
        }
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">Coupon Management</h3>
                            </div>

                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Code</th>
                                            <th>Type</th>
                                            <th>Value</th>
                                            <th>Minimum Order</th>
                                            <th>Valid Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datasList.length > 0 ? (
                                            datasList.map((item, k) => (
                                                <tr key={k}>
                                                    <td>{item.id}</td>
                                                    <td>
                                                        <span className="badge badge-primary">
                                                            {item.code}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {item.type === 'percent' ? 'Percent (%)' : 'Fixed ($)'}
                                                    </td>

                                                    <td>
                                                        {item.type === 'percent'
                                                            ? item.value + '%'
                                                            : '$' + item.value}
                                                    </td>

                                                    <td>${item.minimum_amount}</td>

                                                    <td>
                                                        {moment(item.start_date).format('DD/MM/YYYY')} -{' '}
                                                        {moment(item.end_date).format('DD/MM/YYYY')}
                                                    </td>

                                                    <td>
                                                        {item.active ? (
                                                            <span className="badge badge-success">Active</span>
                                                        ) : (
                                                            <span className="badge badge-danger">Inactive</span>
                                                        )}
                                                    </td>

                                                    <td width="170">
                                                        <Link
                                                            href={route('coupons.edit', item.id)}
                                                            className="btn btn-info btn-xs mr-2"
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </Link>

                                                        <button
                                                            onClick={() => confirmDeletion(item)}
                                                            type="button"
                                                            className="btn btn-danger btn-xs"
                                                        >
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8}>There are no records!</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <Modal show={confirmingDeletion} onClose={closeModal}>
                                    <form onSubmit={deleteRow} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Confirmation!
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Are you sure you want to delete coupon{' '}
                                            <span className="text-lg font-medium">
                                                {deleteData.code}
                                            </span>
                                            ?
                                        </p>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={closeModal}
                                            >
                                                No
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-danger ms-3"
                                                disabled={processing}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </form>
                                </Modal>
                            </div>

                            <div className="card-footer clearfix">
                                <Pagination links={couponData.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}