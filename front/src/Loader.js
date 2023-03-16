function Loader({ show }) {

    if (!show) {
        return;
    }

    return (
        <div className="box-loader d-flex justify-content-center align-items-center">
            <div className="icon-loader">
                <svg version="1.1" id="L2" x="0px" y="0px"
                    viewBox="0 0 100 100" enableBackground="new 0 0 100 100" space="preserve">
                    <circle fill="none" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="48" />
                    <line fill="none" strokeLinecap="round" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
                        <animateTransform
                            attributeName="transform"
                            dur="2s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
                    </line>
                    <line fill="none" strokeLinecap="round" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
                        <animateTransform
                            attributeName="transform"
                            dur="15s"
                            type="rotate"
                            from="0 50 50"
                            to="360 50 50"
                            repeatCount="indefinite" />
                    </line>
                </svg>
            </div>
        </div>
    );
}

export default Loader