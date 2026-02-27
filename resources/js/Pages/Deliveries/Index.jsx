import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

export default function DeliveriesPage({ deliveryData }) {
    // Use deliveryData array directly (controller passes it as an array, not paginated)
    const datasList = Array.isArray(deliveryData) ? deliveryData : (deliveryData?.data || []);
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({});

    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, clearErrors } =
        useForm({
            id: '',
            location: ''
        });

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id);
        setDeleteData('location', data.location);
        setConfirmingDataDeletion(true);
    };

    const closeModal = () => {
        setConfirmingDataDeletion(false);
        setDataEdit({});
        clearErrors();
        reset();
    };

    const deleteDataRow = (e) => {
        e.preventDefault();
        destroy(route('deliveries.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: reset,
        });
    };

    const headWeb = 'Delivery List';
    const linksBreadcrumb = [
        {
            title: 'Create',
            type: 'button',
            url: route('deliveries.create'),
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
                                <h3 className="card-title">Datalist Management</h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                                        <input
                                            type="text"
                                            name="table_search"
                                            className="form-control float-right"
                                            placeholder="Search"
                                        />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-default">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Location</th>
                                            <th>Cost</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datasList.length > 0 ? (
                                            datasList.map((item, k) => (
                                                <tr key={k}>
                                                    <td>{item.id}</td>
                                                    <td>{item.location}</td>
                                                    <td>${Number(item.cost).toFixed(2)}</td>
                                                    <td>{moment(item.created_at).format('DD/MM/YYYY')}</td>
                                                    <td width="170">
                                                        <Link
                                                            href={route('deliveries.edit', item.id)}
                                                            className="btn btn-info btn-xs mr-2"
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </Link>

                                                        <button
                                                            onClick={() => confirmDataDeletion(item)}
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
                                                <td colSpan={5}>There are no records!</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Modal for deletion confirmation */}
                                <Modal show={confirmingDataDeletion} onClose={closeModal}>
                                    <form onSubmit={deleteDataRow} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Confirmation!</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Are you sure you want to delete{' '}
                                            <span className="text-lg font-medium">{deleteData.location}</span>?
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
                                <Pagination links={deliveryData.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}