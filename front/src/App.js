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
  const [transaction, setTransaction] = useState({})

  const [invoiceDocument, setInvoiceDocument] = useState('')
  const [invoiceZipcode, setInvoiceZipcode] = useState('')
  const [invoiceStreetName, setInvoiceStreetName] = useState('')
  const [invoiceStreetNumber, setInvoiceStreetNumber] = useState('')
  const [invoiceNeighborhood, setInvoiceNeighborhood] = useState('')
  const [invoiceCity, setInvoiceCity] = useState('')
  const [invoiceFederalUnit, setInvoiceFederalUnit] = useState('')
  const [billet, setBillet] = useState('')

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
    setLoader(true)
    let data
    if (payment === 1) {
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

      data = {
        name: name,
        email: email,
        total: parseInt(total.replace(/\D/igm, '')),
        cardToken: cardToken.id,
        paymentMethodId: paymentMethodId,
        issuerId: issuerId,
      }
    } else {
      data = {
        name: name,
        email: email,
        total: parseInt(total.replace(/\D/igm, '')),
        paymentMethodId: 'bolbradesco',
        invoiceDocument: invoiceDocument.replace(/\D/igm, ''),
        invoiceZipcode: invoiceZipcode.replace(/\D/igm, ''),
        invoiceStreetName: invoiceStreetName,
        invoiceStreetNumber: invoiceStreetNumber.replace(/\D/igm, ''),
        invoiceNeighborhood: invoiceNeighborhood,
        invoiceCity: invoiceCity,
        invoiceFederalUnit: invoiceFederalUnit,
      }
    }

    Request('POST', 'orders', data, (res) => {
      if (!res.status || !res.status_detail) {
        setError('Ocorreu um erro ao processar o pagamento, favor tente mais tarde.')
        return
      }

      if (payment === 1) {
        if (res.status !== 'approved' || res.status_detail !== 'accredited') {
          setError('Pagamento recusado!')
          return
        }
      } else {
        if (!res.transaction_details || !res.transaction_details.external_resource_url) {
          setError('Erro ao gerar seu boleto!')
          return
        }

        setBillet(res.transaction_details.external_resource_url)
      }

      setTransaction(res)

      setPage(3)
      setLoader(false)
      setName('')
      setEmail('')
      setTotal('')
      setError('')
      setCardNumber('')
      setExpirateMonth('01')
      setExpirateYear('2023')
      setCVV('')
      setHolderName('')
      setHolderDocument('')

      setInvoiceDocument('')
      setInvoiceZipcode('')
      setInvoiceStreetName('')
      setInvoiceStreetNumber('')
      setInvoiceNeighborhood('')
      setInvoiceCity('')
      setInvoiceFederalUnit('')
    }, (err) => {
      setLoader(false)
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
            <div className={(page === 3 ? 'bg-success text-white' : 'bg-light') + ' p-3 text-center rounded-pill'}>3. Pagamento realizado</div>
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
          </form>) : <></>}
        {page === 2 ? (
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
                      </div>) : (payment === 2 ? (
                        <>
                          <div className="form-row mt-3">
                            <div className="col-md-3 form-group">
                              <label>CPF do Titular:</label>
                              <InputMask mask="cpf" className="form-control" value={invoiceDocument} onChange={e => setInvoiceDocument(e.target.value)} />
                            </div>
                          </div>
                          <div className="form-row">
                            <div className="col-md-3 form-group">
                              <label>CEP:</label>
                              <InputMask mask="cep" className="form-control" value={invoiceZipcode} onChange={e => setInvoiceZipcode(e.target.value)} />
                            </div>
                            <div className="col-md-3 form-group">
                              <label>Logradouro:</label>
                              <input type="text" className="form-control" value={invoiceStreetName} onChange={e => setInvoiceStreetName(e.target.value)} />
                            </div>
                            <div className="col-md-3 form-group">
                              <label>Número:</label>
                              <InputMask mask="num" className="form-control" value={invoiceStreetNumber} onChange={e => setInvoiceStreetNumber(e.target.value)} />
                            </div>
                            <div className="col-md-3 form-group">
                              <label>Bairro:</label>
                              <input type="text" className="form-control" value={invoiceNeighborhood} onChange={e => setInvoiceNeighborhood(e.target.value)} />
                            </div>
                            <div className="col-md-3 form-group">
                              <label>Cidade:</label>
                              <input type="text" className="form-control" value={invoiceCity} onChange={e => setInvoiceCity(e.target.value)} />
                            </div>
                            <div className="col-md-3 form-group">
                              <label>UF:</label>
                              <select className="form-control" value={invoiceFederalUnit} onChange={e => setInvoiceFederalUnit(e.target.value)}>
                                <option value="">Selecione</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (<></>))}
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
        ) : <></>}
        {page === 3 ? (
          <>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h1 className="text-center">Pagamento processado com sucesso!</h1>
                    {billet && payment === 2 ? (
                      <>
                        <h4 className="mt-4">Link do boleto:</h4>
                        <a href={billet} target="_blank" rel="noreferrer">{billet}</a>
                      </>
                    ) : <></>}
                    <h4 className="mt-4">Dados do Pagamento:</h4>
                    <div className="bg-light border p-3">
                      <code>{JSON.stringify(transaction, null, 4)}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-3">
              <span className="btn btn-warning mr-3" onClick={_ => setPage(1)}>NOVO CHECKOUT</span>
            </div>
            <div className="mt-4"></div>
          </>
        ) : <></>}
      </div>
    </>
  );
}

export default App;
