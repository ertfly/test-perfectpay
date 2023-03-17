import { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from 'axios'
import InputMask from './InputMask'
import { loadMercadoPago } from '@mercadopago/sdk-js'

async function Request(method, url, data, success, error, loader) {
  if (typeof (data) == 'undefined')
    data = {}
  if (typeof (success) != 'function')
    success = () => { }
  if (typeof (error) != 'function')
    error = () => { }

  let urlRequest = process.env.REACT_APP_API_HOST + '/' + url

  axios({
    method: method,
    url: urlRequest,
    data: data,
  }).then((res) => {
    if (typeof (res.data.response) !== 'object' || typeof (res.data.data) === 'undefined') {
      error('Resposta do servidor inválida')
      return
    }

    let response = res.data.response
    let data = res.data.data

    if (typeof (response.code) !== 'number') {
      error('Resposta do servidor inválida')
      return
    }

    if (response.code !== 0) {
      error(response.msg)
      return;
    }

    success(data)
  })
}

function App() {
  const [first, setFirst] = useState(true)
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [total, setTotal] = useState('')
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(0)

  const [cardNumber, setCardNumber] = useState('')
  const [expirateMonth, setExpirateMonth] = useState('01')
  const [expirateYear, setExpirateYear] = useState('2023')
  const [cvv, setCVV] = useState('')
  const [holderName, setHolderName] = useState('')
  const [holderDocument, setHolderDocument] = useState('')

  const submitPersonalData = (e) => {
    e.preventDefault()
    if (name.trim() === '' || email.trim() === '' || total.trim() === '') {
      setError('Existem campo obrigatórios')
      return;
    }
    setError('')
    setLoader(true)
    window.setTimeout(() => {
      setLoader(false)
      setPage(2)
    }, 500)
  }
  const submitCheckout = async (e) => {
    e.preventDefault()
    await loadMercadoPago();
    const mp = new window.MercadoPago('TEST-2da1a4b3-6ce6-4044-b610-00718add9291', {
      locale: 'pt-BR',
    })
    const paymentMethods = await mp.getPaymentMethods({ bin: cardNumber })
    if (!paymentMethods.results && paymentMethods.results.length === 0) {
      setError('Cartão de crédito inválido.')
      return
    }
    let paymentMethodId = paymentMethods.results[0].id

    const issuers = await mp.getIssuers({ paymentMethodId: paymentMethodId, bin: cardNumber }).catch(e => console.error(e))
    if (!issuers && issuers.length === 0) {
      setError('Cartão de crédito inválido.')
      return
    }
    let issuerId = issuers[0].id

    const cardToken = await mp.createCardToken({
      cardNumber: cardNumber,
      cardholderName: holderName,
      cardExpirationMonth: expirateMonth,
      cardExpirationYear: expirateYear,
      securityCode: cvv,
      identificationType: 'CPF',
      identificationNumber: holderDocument.replace(/\D/igm, ''),
    })


    let data = {
      name: name,
      email: email,
      total: parseInt(total.replace(/\D/igm, '')),
      cardToken: cardToken.id,
      paymentMethodId: paymentMethodId,
      issuerId: issuerId,
    }

    Request('POST', 'orders', data, (res) => {
      console.log('sucesso', res);

    }, (err) => {
      setError(err)
      window.setTimeout(_ => {
        setError('')
      }, 3000)
    })
  }
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (first) {
      setFirst(false)
    }
  }, [first])

  return (
    <>
      <Loader show={loader} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div className={(page === 1 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>1. Dados Pessoais</div>
          </div>
          <div className="col-md-4">
            <div className={(page === 2 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>2. Formas de Pagamento</div>
          </div>
          <div className="col-md-4">
            <div className={(page === 3 ? 'bg-primary text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>3. Pagamento realizado</div>
          </div>
        </div>
        {error ? <div className="alert alert-danger mt-3 rounded-pill">{error}</div> : <></>}
        {page === 1 ?
          (<form onSubmit={submitPersonalData}>
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">PREENCHA SEUS DADOS PESSOAIS</div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="col-md-4">
                        <label>Nome Completo:<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label>E-mail:<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label>Valor (R$):<span className="text-danger">*</span></label>
                        <InputMask mask="dec_2" className="form-control text-right" value={total} onChange={e => setTotal(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 text-right">
                <button type="submit" className="btn btn-primary">CONTINUAR</button>
              </div>
            </div>
          </form>) : (
            <form onSubmit={submitCheckout}>
              <div className="row mt-3">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">ESCOLHA SUA FORMA DE PAGAMENTO</div>
                    <div className="card-body">
                      <div className="form-row">
                        <div className="col-md-6">
                          <span className={'btn btn-light btn-block border py-4 text-center ' + (payment === 1 ? 'bg-primary text-white' : 'text-dark')} onClick={_ => setPayment(1)}>
                            <i className="fas fa-credit-card fa-5x"></i><br />
                            <b className="d-inline-block mt-3">CARTÃO DE CRÉDITO</b>
                          </span>
                        </div>
                        <div className="col-md-6">
                          <span className={'btn btn-light btn-block border py-4 text-center ' + (payment === 2 ? 'bg-primary text-white' : 'text-dark')} onClick={_ => setPayment(2)}>
                            <i className="fas fa-barcode fa-5x"></i><br />
                            <b className="d-inline-block mt-3">BOLETO</b>
                          </span>
                        </div>
                      </div>
                      {payment === 1 ? (
                        <div className="form-row mt-3">
                          <div className="col-md-4 form-group">
                            <label>Número do Cartão:</label>
                            <InputMask mask="num" className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                          </div>
                          <div className="col-md-2 form-group">
                            <label>Expiração (Mês):</label>
                            <select className="form-control" value={expirateMonth} onChange={e => setExpirateMonth(e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((a, i) => (
                                <option key={i} value={String(a).padStart(2, '0')}>{String(a).padStart(2, '0')}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-2 form-group">
                            <label>Expiração (Ano):</label>
                            <select className="form-control" value={expirateYear} onChange={e => setExpirateYear(e.target.value)}>
                              {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((a, i) => (
                                <option key={i} value={a}>{a}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4 form-group">
                            <label>CVV:</label>
                            <input type="number" className="form-control" value={cvv} onChange={e => setCVV(e.target.value)} />
                          </div>
                          <div className="col-md-6 form-group">
                            <label>Nome do Titular:</label>
                            <input type="text" className="form-control" value={holderName} onChange={e => setHolderName(e.target.value)} />
                          </div>
                          <div className="col-md-6 form-group">
                            <label>CPF do Titular:</label>
                            <InputMask mask="cpf" className="form-control" value={holderDocument} onChange={e => setHolderDocument(e.target.value)} />
                          </div>
                        </div>) : (payment === 2 ? (<>
                        </>) : (<></>))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 text-right">
                  <span className="btn btn-warning mr-3" onClick={_ => setPage(1)}>VOLTAR</span>
                  <button type="submit" className="btn btn-primary">PROCESSAR PAGAMENTO</button>
                </div>
              </div>
            </form>
          )}
      </div>
    </>
  );
}

export default App;
