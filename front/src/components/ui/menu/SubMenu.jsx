import { Link } from "react-router-dom"

import "./style/sub_menu.sass"


export function SubMenu() {
    return(
        <nav className="submenu">
            <div className="wrapper">
                <ul className="submenu__nav">
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link" to="/">
                            <svg
                                className="submenu__nav-img"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24" height="26" viewBox="0 0 24 26" fill="none"
                            >
                                <g clipPath="url(#clip0_1_13)">
                                    <path
                                        stroke="#2A52BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        d="M4.17734 25C2.60668 25 1.33334 23.6933 1.33334 22.08V10.344C1.33334 9.45734 1.72668 8.61734 2.40001 8.064L10.2227 1.64C10.7225 1.22611 11.3511 0.999634 12 0.999634C12.6489 0.999634 13.2775 1.22611 13.7773 1.64L21.5987 8.064C22.2733 8.61734 22.6667 9.45734 22.6667 10.344V22.08C22.6667 23.6933 21.3933 25 19.8227 25H4.17734Z"
                                    />
                                    <path
                                        stroke="#2A52BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        d="M8.66669 25V17.6667C8.66669 16.9594 8.94764 16.2811 9.44774 15.781C9.94783 15.281 10.6261 15 11.3334 15H12.6667C13.3739 15 14.0522 15.281 14.5523 15.781C15.0524 16.2811 15.3334 16.9594 15.3334 17.6667V25"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_13">
                                        <rect fill="#2A52BE" width="24" height="26"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            Главная
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link" to="/create">
                            <svg
                                className="submenu__nav-img"
                                xmlns="http://www.w3.org/2000/svg"
                                width="26" height="26" viewBox="0 0 26 26"
                            >
                                <g clipPath="url(#clip0_1_14)">
                                    <path
                                        fill="white"
                                        d="M15.4375 17.875V16.25H16.25V10.5625H15.4375V8.9375H18.6875V10.5625H17.875V16.25H18.6875V17.875H15.4375ZM12.5938 17.875H14.2188L11.375 8.9375H8.9375L6.09619 17.875H7.72119L8.2095 16.25H12.0916L12.5938 17.875ZM8.69863 14.625L10.0214 10.2286L10.2294 10.2261L11.5895 14.625H8.69863ZM26 3.25H22.75V0H21.125V3.25H17.875V4.875H21.125V8.125H22.75V4.875H26V3.25ZM24.375 9.75H26V11.375H24.375V9.75ZM14.625 0H16.25V1.625H14.625V0Z"
                                    />
                                    <path fill="white" d="M26 26H0V0H11.375V1.625H1.625V24.375H24.375V14.625H26V26Z"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_14">
                                        <rect fill="white" width="26" height="26"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            Создать
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link" to="/popular">
                            <svg
                                className="submenu__nav-img"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14" height="26" viewBox="0 0 14 26"
                            >
                                <g clipPath="url(#clip0_1_7)">
                                    <path fill="#F4A900" d="M5.83333 16.1379H0L8.16667 -0.597687V8.96553H14L5.83333 25.7012V16.1379Z"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_7">
                                        <rect fill="#F4A900" width="14" height="26"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            Популярное
                        </Link>
                    </li>
                    <li className="submenu__nav-item">
                        <Link className="submenu__nav-link" to="/popular">
                            <svg
                                className="submenu__nav-img"
                                xmlns="http://www.w3.org/2000/svg"
                                width="29" height="25" viewBox="0 0 29 25"
                            >
                                <path stroke="#9B2D30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 2H27M4 7.25H24M7 12.5H21M1 23H27M4 17.75H24"/>
                            </svg>
                            Категории
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
