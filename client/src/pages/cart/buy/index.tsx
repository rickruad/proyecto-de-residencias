import { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';

import Head from '@/components/Head';

import styles from '@/styles/buy.module.css';

export default function Buy() {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return <>
    <Head title='Comprar' />

    <section className={styles.centerSection}>
      <div className={styles.showInfo}>
        <form onSubmit={handleSubmit}>
          <h2>Formulario de pago</h2>
          <div>
            <h3>Ingrese los datos de su tarjeta</h3>
            <div>
              <label>Tipo de tarjeta</label>
              <select required={true}>
                <option value="">Visa</option>
                <option value="">Mastercard</option>
              </select>
            </div>
            <div>
              <div>
                <label>Número de la tarjeta</label>
                <input type="number" required={true} />
              </div>
              <div>
                <label>Fecha de caducidad</label>
                <input type="month" required={true} />
              </div>
              <div>
                <label>Código de seguridad</label>
                <input type="number" maxLength={4} min={1} minLength={0} required={true} />
              </div>
            </div>
            <div>
              <label>Nombre a cargo de la tarjeta</label>
              <input type="text" pattern="[A-Za-z]+" required={true} />
            </div>
          </div>
          <div>
            <h3>Ingrese sus datos personales</h3>
            <div>
              <label>Nombre completo</label>
              <input type="text" pattern="[A-Za-z]+" required={true} />
            </div>
            <div>
              <label>País</label>
              <input type="text" pattern="[A-Za-z]+" required={true} />
            </div>
            <div>
              <label>Localidad</label>
              <input type="text" pattern="[A-Za-z]+" required={true} />
            </div>
            <div>
              <label>1ra Dirección de facturación</label>
              <input type="text" required={true} />
            </div>
            <div>
              <label>2da Dirección de facturación</label>
              <input type="text" />
            </div>
            <div>
              <label>Código postal</label>
              <input type="text" pattern="[a-zA-Z0-9]+" required={true} />
            </div>
            <div>
              <label>Número de telefono</label>
              <input type="tel" pattern="[0-9+-]+" required={true} />
            </div>
          </div>
          <div>
            <Link href={{ pathname: '../' }}>Regresar</Link>
            <button>Confirmar</button>
          </div>
        </form>
      </div>
    </section>
  </>
}