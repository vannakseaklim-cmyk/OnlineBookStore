import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

export default function QRCodesPage({ qrcodeData }) {
    const qrcodesList = Array.isArray(qrcodeData) ? qrcodeData : (qrcodeData?.data || []);

    const [confirmingQRCodeDeletion, setConfirmingQRCodeDeletion] = useState(false);
    const [qrcodeEdit, setQRCodeEdit] = useState({});

    const { data: deleteQRCode, setData: setDeleteQRCode, delete: destroy, processing, reset, clearErrors } =
        useForm({
            id: '',
            bank_name: ''
        });

    const confirmQRCodeDeletion = (qrcode) => {
        setQRCodeEdit(qrcode);
        setDeleteQRCode('id', qrcode.id);
        setDeleteQRCode('bank_name', qrcode.bank_name);
        setConfirmingQRCodeDeletion(true);
    };

    const closeModal = () => {
        setConfirmingQRCodeDeletion(false);
        setQRCodeEdit({});
        clearErrors();
        reset();
    };

    const deleteQRCodeRow = (e) => {
        e.preventDefault();
        destroy(route('qrcodes.destroy', qrcodeEdit.id), {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: reset,
        });
    };

    const headWeb = 'QR Code Management';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: headWeb, url: '' },
        { title: 'Create', type: 'button', url: route('qrcodes.create'), className: 'btn btn-primary btn-sm' }
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />

            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">Payment QR Codes</h3>
                            </div>

                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>QR Image</th>
                                            <th>Bank Name</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {qrcodesList.length > 0 ? (
                                        qrcodesList.map((qrcode, index) => (
                                            <tr key={qrcode.id}>
                                                <td>{qrcode.id}</td>

                                                {/* QR Image */}
                                                <td>
                                                    {qrcode.qr_image ? (
                                                        <img
                                                            src={`/storage/${qrcode.qr_image}`}
                                                            alt="qr"
                                                            style={{ width: '60px', borderRadius: '4px' }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted small">No Image</span>
                                                    )}
                                                </td>
                                                <td>{qrcode.bank_name}</td>
                                                <td>
                                                    {qrcode.active ? (
                                                        <span className="badge badge-success">Active</span>
                                                    ) : (
                                                        <span className="badge badge-danger">Inactive</span>
                                                    )}
                                                </td>

                                                <td>{moment(qrcode.created_at).format('DD/MM/YYYY')}</td>

                                                <td className="text-center">
                                                    <Link
                                                        href={route('qrcodes.edit', qrcode.id)}
                                                        className="btn btn-info btn-xs mr-2"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>

                                                    <button
                                                        onClick={() => confirmQRCodeDeletion(qrcode)}
                                                        className="btn btn-danger btn-xs"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center">
                                                There are no records!
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>

                                </table>

                                {/* Delete Modal */}
                                <Modal show={confirmingQRCodeDeletion} onClose={closeModal}>
                                    <form onSubmit={deleteQRCodeRow} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Confirmation!</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Are you sure you want to delete{' '}
                                            <span className="text-lg font-medium">{deleteQRCode.bank_name}</span>?
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
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
