import { Link, usePage } from '@inertiajs/react'
import $ from 'jquery'
import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'
import { useEffect } from 'react'

export default function MenuSideBar() {
    const { auth } = usePage().props
    const can = auth?.can ?? {}

    useEffect(() => {
        $('[data-widget="treeview"]').Treeview('init')
    }, [])

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            
            {/* Brand */}
            <Link href="/" className="brand-link text-center">
                <span className="brand-text font-weight-light">ADMIN</span>
            </Link>

            <div className="sidebar">

                {/* User Panel */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img
                            src="/images/avatar.png"
                            className="img-circle elevation-2"
                            alt="User"
                        />
                    </div>
                    <div className="info">
                        <Link href="#" className="d-block">
                            {auth?.user?.name}
                        </Link>
                    </div>
                </div>

                {/* Sidebar Menu */}
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        data-accordion="true"
                    >

                        {/* Dashboard */}
                        <li className="nav-item">
                            <Link
                                href={route('dashboard')}
                                className={`nav-link ${route().current('dashboard') ? 'active' : ''}`}
                            >
                                <i className="nav-icon fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </Link>
                        </li>

                        {/* Category */}
                        <li className="nav-item">
                            <Link
                                href={route('categories.index')}
                                className={`nav-link ${route().current('categories.*') ? 'active' : ''}`}
                            >
                                <i className="nav-icon fa-solid fa-table-cells"></i>
                                <p>Category</p>
                            </Link>
                        </li>

                        {/* Book */}
                        <li className="nav-item">
                            <Link
                                href={route('books.index')}
                                className={`nav-link ${route().current('books.*') ? 'active' : ''}`}
                            >
                                <i className="nav-icon fas fa-book"></i>
                                <p>Book</p>
                            </Link>
                        </li>

                        {/* Order */}
                        <li className="nav-item">
                            <Link
                                href={route('orders.index')}
                                className={`nav-link ${route().current('orders.*') ? 'active' : ''}`}
                            >
                                <i className="nav-icon fa-solid fa-cart-shopping"></i>
                                <p>Order</p>
                            </Link>
                        </li>

                        {/* Report */}
                        <li className="nav-item">
                            <Link
                                href={route('reports.index')}
                                className={`nav-link ${route().current('reports.*') ? 'active' : ''}`}
                            >
                                <i className="nav-icon fa-solid fa-chart-line"></i>
                                <p>Report</p>
                            </Link>
                        </li>

                        {/* SETTINGS (TREEVIEW) */}
                        {can['category-list'] && (
                            <li className={`nav-item ${route().current('coupons.*') || route().current('deliveries.*') ? 'menu-open' : ''}`}>
                                <a
                                    href="#"
                                    className={`nav-link ${route().current('coupons.*') || route().current('deliveries.*') ? 'active' : ''}`}
                                >
                                    <i className="nav-icon fa-solid fa-sliders"></i>
                                    <p>
                                        Settings
                                        <i className="right fas fa-angle-left"></i>
                                    </p>
                                </a>

                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link
                                            href={route('coupons.index')}
                                            className={`nav-link ${route().current('coupons.*') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-tag"></i>
                                            <p>Coupon</p>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            href={route('discounts.index')}
                                            className={`nav-link ${route().current('discounts.*') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-tag"></i>
                                            <p>Discount</p>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            href={route('deliveries.index')}
                                            className={`nav-link ${route().current('deliveries.*') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-truck"></i>
                                            <p>Delivery</p>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            href={route('qrcodes.index')}
                                            className={`nav-link ${route().current('qrcodes.*') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-qrcode"></i>
                                            <p>QR Code</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {/* AUTH HEADER */}
                        {(can['role-list'] || can['user-list']) && (
                            <li className="nav-header">AUTHENTICATION</li>
                        )}

                        {/* ROLE */}
                        {can['role-list'] && (
                            <li className={`nav-item ${route().current('roles.*') ? 'menu-open' : ''}`}>
                                <a href="#" className={`nav-link ${route().current('roles.*') ? 'active' : ''}`}>
                                    <i className="nav-icon far fa-plus-square"></i>
                                    <p>
                                        Role
                                        <i className="right fas fa-angle-left"></i>
                                    </p>
                                </a>

                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link
                                            href={route('roles.index')}
                                            className={`nav-link ${route().current('roles.index') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-list-ul text-warning"></i>
                                            <p>List</p>
                                        </Link>
                                    </li>

                                    {can['role-create'] && (
                                        <li className="nav-item">
                                            <Link
                                                href={route('roles.create')}
                                                className={`nav-link ${route().current('roles.create') ? 'active' : ''}`}
                                            >
                                                <i className="nav-icon fa-regular fa-square-plus text-info"></i>
                                                <p>Create</p>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        )}

                        {/* USER */}
                        {can['user-list'] && (
                            <li className={`nav-item ${route().current('users.*') ? 'menu-open' : ''}`}>
                                <a href="#" className={`nav-link ${route().current('users.*') ? 'active' : ''}`}>
                                    <i className="nav-icon far fa-plus-square"></i>
                                    <p>
                                        User
                                        <i className="right fas fa-angle-left"></i>
                                    </p>
                                </a>

                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link
                                            href={route('users.index')}
                                            className={`nav-link ${route().current('users.index') ? 'active' : ''}`}
                                        >
                                            <i className="nav-icon fa-solid fa-list-ul text-warning"></i>
                                            <p>List</p>
                                        </Link>
                                    </li>

                                    {can['user-create'] && (
                                        <li className="nav-item">
                                            <Link
                                                href={route('users.create')}
                                                className={`nav-link ${route().current('users.create') ? 'active' : ''}`}
                                            >
                                                <i className="nav-icon fa-regular fa-square-plus text-info"></i>
                                                <p>Create</p>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        )}

                    </ul>
                </nav>
            </div>
        </aside>
    )
}