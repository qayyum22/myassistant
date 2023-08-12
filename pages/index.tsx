import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import mainImage from '@/assets/images/chatbot.png'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'


export default function Home() {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if(prompt){
      try{
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/assistant?prompt=" + encodeURIComponent(prompt));
        const body = await response.json();
        setQuote(body.quote);

      }catch(error){
        console.error(error);
        setQuoteLoadingError(true);
      } finally{
        setQuoteLoading(false);
      }
      
    }
  }
  return (
    <>
      <Head>
        <title>My AI Assistant</title>
        <meta name="description" content="by Qayyum Siddiqui" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>AI Assistant</h1>
        <h2>powered by GPT-3</h2>
        <div>What do you need me to do?</div>
        <div className={styles.mainImageContainer}>
        <Image 
        src={mainImage}
        fill
        alt="AI chatbot"
        priority
        className={styles.mainImage}
        />
        </div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
            <Form.Group className='mb-3' controlId='prompt-input'>
              <Form.Label>Assist me with this ...</Form.Label>
              <Form.Control
              name='prompt'
              placeholder='e.g. create a bio'
              maxLength={100}
              />
            </Form.Group>
            <Button type='submit' className='mb-3' disabled={quoteLoading}>
              Assist Me
            </Button>
        </Form>
        {quoteLoading && <Spinner animation='border'/>}
        {quoteLoadingError && "Something went wrong. Please try again"}
        {quote && <h5>{quote}</h5>}
      </main>
    </>
  )
}
