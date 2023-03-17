import { useState } from "react"

function InputMask({ type, className, placeholder, mask, defaultValue, value, clear, style, onChange }) {
    const [val,setVal] =useState(value)
    const maskPad = (e, $, d) => {
        d = d || "0"
        e += ""
        return e.length >= $ ? e : new Array($ - e.length + 1).join(d) + e;
    }
    const maskUpdate = (type, value) => {
        let e
        switch (type) {
            case 'num':
                return value.replace(/\D/g, "")
            case 'dec_4':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 18);
                e = "" !== e ? parseInt(e) : ""
                if (isNullEmpty(e)) {
                    return ''
                }
                e = maskPad(e.toString(), 5)
                e = e.replace(/(\d)(\d{4})$/g, "$1,$2")
                e = e.replace(/(\d)(\d{3}),(\d{4})$/g, "$1.$2,$3")
                e = e.replace(/(\d)(\d{3})\.(\d{3}),(\d{4})$/g, "$1.$2.$3,$4")
                e = e.replace(/(\d)(\d{3})\.(\d{3})\.(\d{3}),(\d{4})$/g, "$1.$2.$3.$4,$5")
                return e
            case 'dec_3':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 18);
                e = "" !== e ? parseInt(e) : ""
                if (isNullEmpty(e)) {
                    return ''
                }
                e = maskPad(e.toString(), 4)
                e = e.replace(/(\d)(\d{3})$/g, "$1,$2")
                e = e.replace(/(\d)(\d{3}),(\d{3})$/g, "$1.$2,$3")
                e = e.replace(/(\d)(\d{3})\.(\d{3}),(\d{3})$/g, "$1.$2.$3,$4")
                e = e.replace(/(\d)(\d{3})\.(\d{3})\.(\d{3}),(\d{3})$/g, "$1.$2.$3.$4,$5")
                return e
            case 'dec_2':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 18)
                e = "" !== e ? parseInt(e) : ""
                if (isNullEmpty(e)) {
                    return ''
                }
                e = maskPad(e.toString(), 3)
                e = e.replace(/(\d)(\d{2})$/g, "$1,$2")
                e = e.replace(/(\d)(\d{3}),(\d{2})$/g, "$1.$2,$3")
                e = e.replace(/(\d)(\d{3})\.(\d{3}),(\d{2})$/g, "$1.$2.$3,$4")
                e = e.replace(/(\d)(\d{3})\.(\d{3})\.(\d{3}),(\d{2})$/g, "$1.$2.$3.$4,$5")
                return e
            case 'dec_1':
                e = value.replace(/\D/g, "")
                e = "" !== e ? parseInt(e) : "";
                if (isNullEmpty(e)) {
                    return ''
                }
                e = maskPad(e.toString(), 2)
                e = e.replace(/(\d)(\d{1})$/g, "$1,$2")
                e = e.replace(/(\d)(\d{3}),(\d{1})$/g, "$1.$2,$3")
                e = e.replace(/(\d)(\d{3})\.(\d{3}),(\d{1})$/g, "$1.$2.$3,$4")
                e = e.replace(/(\d)(\d{3})\.(\d{3})\.(\d{3}),(\d{1})$/g, "$1.$2.$3.$4,$5")
                return e
            case 'data_a':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 8)
                e = e.replace(/^(\d{2})(\d)/g, "$1/$2")
                e = e.replace(/^(\d{2})\/(\d{2})(\d)/g, "$1/$2/$3")
                return e
            case 'data_b':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 12)
                e = e.replace(/^(\d{2})(\d)/g, "$1/$2")
                e = e.replace(/^(\d{2})\/(\d{2})(\d)/g, "$1/$2/$3")
                e = e.replace(/^(\d{2})\/(\d{2})\/(\d{4})(\d)/g, "$1/$2/$3 $4")
                e = e.replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})(\d)/g, "$1/$2/$3 $4:$5")
                return e
            case 'data_c':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 6)
                e = e.replace(/^(\d{2})(\d)/g, "$1/$2")
                return e
            case 'data_d':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 4)
                e = e.replace(/^(\d{2})(\d)/g, "$1/$2")
                return e
            case 'time':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 4)
                e = e.replace(/^(\d{2})(\d)/g, "$1:$2")
                return e
            case 'creditcard':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 16)
                e = e.replace(/^(\d{4})(\d)/g, "$1 $2")
                e = e.replace(/^(\d{4}) (\d{4})(\d)/g, "$1 $2 $3")
                e = e.replace(/^(\d{4}) (\d{4}) (\d{4})(\d)/g, "$1 $2 $3 $4")
                return e;
            case 'cnpj':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 14)
                e = e.replace(/^(\d{2})(\d)/g, "$1.$2")
                e = e.replace(/^(\d{2})\.(\d{3})(\d)/g, "$1.$2.$3")
                e = e.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/g, "$1.$2.$3/$4")
                e = e.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/g, "$1.$2.$3/$4-$5")
                return e
            case 'cpf':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 11)
                e = e.replace(/^(\d{3})(\d)/g, "$1.$2")
                e = e.replace(/^(\d{3})\.(\d{3})(\d)/g, "$1.$2.$3")
                e = e.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, "$1.$2.$3-$4")
                return e
            case 'cep':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 8)
                e = e.replace(/^(\d{2})(\d)/g, "$1.$2")
                e = e.replace(/(\d)(\d{3})$/g, "$1-$2")
                return e
            case 'phone':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 11)
                e = e.replace(/^(\d{2})(\d)/g, "($1) $2")
                e = e.replace(/(\d)(\d{4})$/g, "$1-$2")
                return e
            case 'phone2':
                e = value.replace(/\D/g, "")
                e = e.substring(0, 10)
                e = e.replace(/^(\d{2})(\d)/g, "($1) $2")
                e = e.replace(/(\d)(\d{4})$/g, "$1-$2")
                return e
            default:
                return e
        }
    }

    const maskKeyup = (e, mask) => {
        if (e.key !== 'Meta') {
            e.target.value = maskUpdate(mask, e.target.value);
        }
        return e.target.value;
    }

    const maskBlur = (ev, mask) => {
        if (!isNullEmpty(mask)) {
            let e;
            switch (mask) {
                case "phone":
                    e = ev.target.value.replace(/\D/g, "");
                    11 !== e.length && 10 !== e.length && (ev.target.value = "");
                    break;
                case "phone2":
                    e = ev.target.value.replace(/\D/g, "");
                    10 !== e.length && (ev.target.value = "");
                    break;
                case "cep":
                    e = ev.target.value.replace(/\D/g, "");
                    8 !== e.length && (ev.target.value = "");
                    break;
                case "cpf":
                    e = ev.target.value.replace(/\D/g, "");
                    11 !== e.length && (ev.target.value = "");
                    break;
                case "cnpj":
                    e = ev.target.value.replace(/\D/g, "");
                    14 !== e.length && (ev.target.value = "");
                    break;
                case "data_a":
                    e = ev.target.value.replace(/\D/g, "");
                    8 !== e.length && (ev.target.value = "");
                    break;
                case "data_b":
                    e = ev.target.value.replace(/\D/g, "");
                    12 !== e.length && (ev.target.value = "");
                    break;
                case "data_c":
                    e = ev.target.value.replace(/\D/g, "");
                    6 !== e.length && (ev.target.value = "");
                    break;
                case "data_d":
                    e = ev.target.value.replace(/\D/g, "");
                    4 !== e.length && (ev.target.value = "");
                    break;
                case "cartao":
                    e = ev.target.value.replace(/\D/g, "");
                    16 !== e.length && (ev.target.value = "");
                    break;
                case "time":
                    e = ev.target.value.replace(/\D/g, "");
                    4 !== e.length && (ev.target.value = "");
                    break;
                default:
            }
            return ev.target.value;
        }

        return '';
    }

    const isNullEmpty = (value) => {
        if (typeof (value) == 'undefined') {
            return true;
        }

        if (value === null) {
            return true;
        }

        if (typeof (value) === 'string' && value.toString().trim() === '') {
            return true;
        }

        return false;
    }

    return (
        <input
            type={type}
            style={style}
            className={className}
            placeholder={placeholder}
            value={val}
            onChange={e => setVal(mask ? maskKeyup(e, mask) : e.target.value)}
            onBlur={(e) => { setVal(mask ? maskBlur(e, mask) : e.target.value); onChange(e) }}
            onClick={(e) => { e.target.select() }} />
    )
}

/* class InputMask extends Component {
    
    

    

    

    

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.on) {
            return ({
                ...prevState,
                value: nextProps.value,
            })
        }
        if (nextProps.store.success !== '') {
            return ({
                ...prevState,
                value: '',
            })
        }

        return null
    }

    render() {
        
    }
}

 */

InputMask.defaultProps = {
    type: 'text',
    className: 'form-control',
    placeholder: '',
    mask: '',
    defaultValue: null,
    value: null,
    clear: false,
    style: {},
    onChange: () => { }
}

export default InputMask