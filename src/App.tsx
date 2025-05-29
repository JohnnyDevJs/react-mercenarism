import { useState, useTransition } from 'react'

import { Box, Button, Container, TextField, Typography, Grid } from '@mui/material'


import { groq } from './lib/groq'

import './App.css'

function App() {
  const [isPending, startTransition] = useTransition()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  async function handleSendQuestion() {
    if (!question.trim()) {
      setAnswer('Por favor, escreva uma pergunta antes de enviar. Sou mercenário, mas não adivinho perguntas!')
      return
    }
  
    startTransition(async () => {
      try {
        const messagePrompt = `
          Responda como se fosse um "mercenário": Sou responsável pelo meu próprio futuro. Estou em uma empresa porque, no momento, ela me oferece a melhor compensação — simples assim. Entrego um trabalho ético e de alta qualidade, não por lealdade à empresa, mas porque isso faz parte da minha missão atual: usar cada experiência como degrau para o próximo nível.
Meu maior ativo é o conhecimento. Sou movido por aprendizado contínuo e avanço técnico. Devoro tecnologias e metodologias de ponta.
Tudo segue padrões — e foi dominando esses padrões que me especializei em resolver projetos críticos. É esse perfil que atrai empresas e iniciativas dispostas a pagar mais e, ao mesmo tempo, oferecer os maiores desafios e aprendizados. A resposta deve ter no máximo 6 linhas:
          ${question}
        `
  
        const completion = await groq.chat.completions.create({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: messagePrompt }],
        })
  
        const responseText = completion.choices[0]?.message?.content || 'Sem resposta.'
        setAnswer(responseText.trim())
      } catch (error) {
        console.error(error)
        setAnswer('Ocorreu um erro ao tentar responder.')
      }
    })
  }

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="black">
        Pergunte ao mercenário:
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={8}>
          <TextField
          error={!question.trim()}
            required
            fullWidth
            label="Pergunta"
            size="small"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Grid>

        <Grid size={4}>
          <Button
            fullWidth
            loading={isPending}
            variant="contained"
            color="primary"
            onClick={handleSendQuestion}
            
          >
            Bora lá
          </Button>
        </Grid>
      </Grid>

      {answer && (
        <Box component="section" color="Background" sx={{ p: 2, border: '1px dashed grey', }}>
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', textAlign: 'left'}}
        >
          {answer}
        </Typography>
        </Box>
      )}
    </Container>
  )
}

export default App