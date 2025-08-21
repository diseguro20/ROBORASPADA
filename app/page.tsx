"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Star, Clock, Timer, AlertCircle } from "lucide-react"

interface ScratchCard {
  name: string
  rtp: number
  multiplier: number
  trend: "up" | "down" | "stable"
}

interface TimePrediction {
  nextHighTime: string
  nextLowTime: string
  currentStatus: "high" | "low" | "medium"
  recommendation: string
}

function generateRandomData(): ScratchCard[] {
  return scratchCards.map((name) => ({
    name,
    rtp: Math.floor(Math.random() * (98 - 60 + 1)) + 60,
    multiplier: Math.floor(Math.random() * (200 - 100 + 1)) + 100,
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
  }))
}

function generateTimePredictions(cardName: string): TimePrediction {
  const hash = cardName.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
  const currentHour = new Date().getHours()
  const currentMinute = new Date().getMinutes()

  const isHighPriorityCard = hash % 3 === 0 // About 1/3 of cards will be high priority

  let highHours, lowHours

  if (isHighPriorityCard) {
    // High priority cards get better timing - closer to current time
    highHours = [currentHour, (currentHour + 1) % 24, (currentHour + 2) % 24]
    lowHours = [(currentHour + 6) % 24, (currentHour + 12) % 24, (currentHour + 18) % 24]
  } else {
    // Regular timing for other cards
    highHours = [(hash % 6) + 6, (hash % 4) + 14, (hash % 3) + 20]
    lowHours = [(hash % 3) + 2, (hash % 5) + 10, (hash % 4) + 16]
  }

  const nextHigh = highHours.find((h) => h > currentHour) || highHours[0] + 24
  const nextLow = lowHours.find((h) => h > currentHour) || lowHours[0] + 24

  const formatTime = (hour: number) => {
    const h = hour % 24
    const minutes = isHighPriorityCard
      ? [15, 30, 45][hash % 3]
      : // High priority gets specific minutes
        hash % 60 // Regular cards get random minutes
    return `${h.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  let currentStatus: "high" | "low" | "medium" = "medium"
  let recommendation = "Momento neutro para jogar"

  if (isHighPriorityCard && currentMinute >= 0 && currentMinute <= 45) {
    currentStatus = "high"
    recommendation = "🔥 MOMENTO IDEAL! RTP e multiplicadores em alta"
  } else if (highHours.some((h) => Math.abs(h - currentHour) <= 1)) {
    currentStatus = "high"
    recommendation = "🔥 MOMENTO IDEAL! RTP e multiplicadores em alta"
  } else if (lowHours.some((h) => Math.abs(h - currentHour) <= 1)) {
    currentStatus = "low"
    recommendation = "⚠️ Aguarde um pouco. Retornos baixos detectados"
  } else if (hash % 4 === 0) {
    // Some random cards get medium-high status
    currentStatus = "high"
    recommendation = "✨ Bom momento para jogar! Chances elevadas"
  }

  return {
    nextHighTime: formatTime(nextHigh),
    nextLowTime: formatTime(nextLow),
    currentStatus,
    recommendation,
  }
}

const scratchCards = [
  "Raspadinha Tudo ou Nada",
  "Raspadinha Minotauro",
  "Raspadinha Show Ball",
  "Raspadinha Pescador",
  "Raspadinha Arrancada",
  "Raspadinha Tigrinho",
  "Raspadinha Rihappy",
  "Raspadinha Honda",
  "Raspadinha Decolar",
  "Raspadinha Casas Bahia",
  "Raspadinha WePink",
  "Raspadinha iFood",
  "Raspadinha Pix na Conta",
  "Raspadinha do Bicho",
  "Raspadinha Amazon",
]

const scratchCardLinks: { [key: string]: string } = {
  "Raspadinha Tudo ou Nada": "https://raspabolada.bet/raspadinhas/show.php?id=18",
  "Raspadinha Minotauro": "https://raspabolada.bet/raspadinhas/show.php?id=17",
  "Raspadinha Show Ball": "https://raspabolada.bet/raspadinhas/show.php?id=16",
  "Raspadinha Pescador": "https://raspabolada.bet/raspadinhas/show.php?id=15",
  "Raspadinha Arrancada": "https://raspabolada.bet/raspadinhas/show.php?id=14",
  "Raspadinha Tigrinho": "https://raspabolada.bet/raspadinhas/show.php?id=12",
  "Raspadinha Rihappy": "https://raspabolada.bet/raspadinhas/show.php?id=11",
  "Raspadinha Honda": "https://raspabolada.bet/raspadinhas/show.php?id=10",
  "Raspadinha Decolar": "https://raspabolada.bet/raspadinhas/show.php?id=9",
  "Raspadinha Casas Bahia": "https://raspabolada.bet/raspadinhas/show.php?id=8",
  "Raspadinha WePink": "https://raspabolada.bet/raspadinhas/show.php?id=7",
  "Raspadinha iFood": "https://raspabolada.bet/raspadinhas/show.php?id=6",
  "Raspadinha Pix na Conta": "https://raspabolada.bet/raspadinhas/show.php?id=5",
  "Raspadinha do Bicho": "https://raspabolada.bet/raspadinhas/show.php?id=4",
  "Raspadinha Amazon": "https://raspabolada.bet/raspadinhas/show.php?id=1",
}

export default function RoboBolada() {
  const [cards, setCards] = useState<ScratchCard[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timePredictions, setTimePredictions] = useState<{ [key: string]: TimePrediction }>({})

  useEffect(() => {
    setCards(generateRandomData())
    const predictions: { [key: string]: TimePrediction } = {}
    scratchCards.forEach((cardName) => {
      predictions[cardName] = generateTimePredictions(cardName)
    })
    setTimePredictions(predictions)

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const sortedCards = [...cards].sort((a, b) => b.rtp - a.rtp)
  const bestCard = sortedCards[0]
  const alternatives = sortedCards.slice(1, 3)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-primary" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
      default:
        return <div className="w-4 h-4 bg-muted-foreground rounded-full" />
    }
  }

  const refreshData = () => {
    setCards(generateRandomData())
    const predictions: { [key: string]: TimePrediction } = {}
    scratchCards.forEach((cardName) => {
      predictions[cardName] = generateTimePredictions(cardName)
    })
    setTimePredictions(predictions)
  }

  const getStatusColor = (status: "high" | "low" | "medium") => {
    switch (status) {
      case "high":
        return "text-green-500"
      case "low":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Money particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500/20 text-xs animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            $
          </div>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`euro-${i}`}
            className="absolute text-green-400/15 text-sm animate-float-reverse opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${20 + Math.random() * 8}s`,
            }}
          >
            €
          </div>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`real-${i}`}
            className="absolute text-green-300/25 text-xs animate-float-diagonal opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${18 + Math.random() * 7}s`,
            }}
          >
            R$
          </div>
        ))}
      </div>

      {/* Main content with higher z-index */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <img
                    src="/images/robo-logo.png"
                    alt="RobôBolada - Analista de Raspadinhas"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">RobôRaspadinhas</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Consultor de Raspadinhas</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-500">
                      Conectado ao sistema oficial:{" "}
                      <a
                        href="https://raspabolada.bet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-400 transition-colors"
                      >
                        raspabolada.bet
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{currentTime.toLocaleTimeString("pt-BR")}</span>
                  <span className="xs:hidden">
                    {currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <Button
                  onClick={refreshData}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-3 bg-transparent"
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
          {/* Main Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
              🔥 Raspadinha em alta agora!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Dados atualizados em tempo real do sistema oficial
            </p>
          </div>

          {/* Best Card - Featured */}
          {bestCard && (
            <div className="mb-6 sm:mb-8">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-muted/20 shadow-lg">
                <CardHeader className="text-center pb-3 sm:pb-4 px-3 sm:px-6">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-secondary" />
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground text-xs sm:text-sm px-2 py-1"
                    >
                      MELHOR DO MOMENTO
                    </Badge>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary leading-tight break-words px-2">
                    {bestCard.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-3 sm:px-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">Taxa de Retorno (RTP)</p>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{bestCard.rtp}%</div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">Multiplicador</p>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary">
                        {bestCard.multiplier}%
                      </div>
                    </div>
                  </div>

                  {timePredictions[bestCard.name] && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Timer className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Análise de Horários</span>
                      </div>

                      <div
                        className={`text-xs sm:text-sm font-medium mb-3 ${getStatusColor(timePredictions[bestCard.name].currentStatus)}`}
                      >
                        {timePredictions[bestCard.name].recommendation}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-1">Próximo Pico</p>
                          <div className="font-bold text-green-500">{timePredictions[bestCard.name].nextHighTime}</div>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground mb-1">Próxima Baixa</p>
                          <div className="font-bold text-red-500">{timePredictions[bestCard.name].nextLowTime}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {getTrendIcon(bestCard.trend)}
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Tendência {bestCard.trend === "up" ? "Alta" : bestCard.trend === "down" ? "Baixa" : "Estável"}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 relative overflow-hidden group min-h-[48px] text-base sm:text-lg font-semibold md:animate-none animate-snake-border"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <a
                      href={scratchCardLinks[bestCard.name] || "https://raspabolada.bet"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-full relative z-10 px-6 py-3"
                    >
                      Jogar Agora
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Alternative Cards */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-foreground px-2">
              Outras Opções em Destaque
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {alternatives.map((card, index) => (
                <Card key={card.name} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg text-primary leading-tight break-words flex-1">
                        {card.name}
                      </CardTitle>
                      <div className="flex-shrink-0">{getTrendIcon(card.trend)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">RTP</p>
                        <div className="text-xl sm:text-2xl font-bold text-primary">{card.rtp}%</div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Multiplicador</p>
                        <div className="text-xl sm:text-2xl font-bold text-secondary">{card.multiplier}%</div>
                      </div>
                    </div>

                    {timePredictions[card.name] && (
                      <div className="mb-3 p-2 bg-muted/20 rounded border border-border/30">
                        <div className="flex items-center gap-1 mb-2">
                          <AlertCircle className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Status Atual</span>
                        </div>
                        <div className={`text-xs ${getStatusColor(timePredictions[card.name].currentStatus)} mb-2`}>
                          {timePredictions[card.name].currentStatus === "high"
                            ? "🔥 Em alta"
                            : timePredictions[card.name].currentStatus === "low"
                              ? "⚠️ Em baixa"
                              : "📊 Neutro"}
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">Pico: {timePredictions[card.name].nextHighTime}</span>
                          <span className="text-red-600">Baixa: {timePredictions[card.name].nextLowTime}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary/20 active:scale-95 relative overflow-hidden group min-h-[44px] text-sm sm:text-base md:animate-none animate-snake-border-outline"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <a
                        href={scratchCardLinks[card.name] || "https://raspabolada.bet"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-full relative z-10 px-4 py-2"
                      >
                        Jogar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center px-2">
            <p className="text-base sm:text-lg font-semibold text-primary mb-4 leading-relaxed">
              ⚡ Aproveite agora os melhores retornos do dia!
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25 active:scale-95 relative overflow-hidden group min-h-[48px] text-base sm:text-lg font-semibold md:animate-none animate-snake-border-secondary"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <a
                href="https://raspabolada.bet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full relative z-10 px-6 py-3"
              >
                Ver Todas as Raspadinhas
              </a>
            </Button>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-5px) rotate(180deg);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-30px) translateX(15px) rotate(270deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-5px) translateX(5px) rotate(360deg);
            opacity: 0.2;
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.15;
          }
          33% {
            transform: translateY(15px) translateX(-10px) rotate(-120deg);
            opacity: 0.5;
          }
          66% {
            transform: translateY(-25px) translateX(8px) rotate(-240deg);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-5px) translateX(-3px) rotate(-360deg);
            opacity: 0.15;
          }
        }

        @keyframes float-diagonal {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.25;
          }
          25% {
            transform: translateY(-15px) translateX(8px) rotate(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-30px) translateX(15px) rotate(180deg);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-20px) translateX(10px) rotate(270deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-5px) translateX(3px) rotate(360deg);
            opacity: 0.25;
          }
        }

        @keyframes snake-border {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-float-reverse {
          animation: float-reverse linear infinite;
        }

        .animate-float-diagonal {
          animation: float-diagonal linear infinite;
        }

        /* Updated snake border animations with proper green glow effect */
        .animate-snake-border {
          position: relative;
          z-index: 1;
        }

        .animate-snake-border::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(90deg, 
            transparent, transparent, transparent,
            rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 1), rgba(34, 197, 94, 0.8),
            transparent, transparent, transparent
          );
          background-size: 300% 300%;
          border-radius: inherit;
          animation: snake-border 2s linear infinite;
          z-index: -1;
        }

        .animate-snake-border-outline {
          position: relative;
          z-index: 1;
        }

        .animate-snake-border-outline::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(90deg, 
            transparent, transparent, transparent,
            rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.6),
            transparent, transparent, transparent
          );
          background-size: 300% 300%;
          border-radius: inherit;
          animation: snake-border 2.5s linear infinite;
          z-index: -1;
        }

        .animate-snake-border-secondary {
          position: relative;
          z-index: 1;
        }

        .animate-snake-border-secondary::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(90deg, 
            transparent, transparent, transparent,
            rgba(34, 197, 94, 0.7), rgba(34, 197, 94, 1), rgba(34, 197, 94, 0.7),
            transparent, transparent, transparent
          );
          background-size: 300% 300%;
          border-radius: inherit;
          animation: snake-border 2.2s linear infinite;
          z-index: -1;
        }

        @media (min-width: 768px) {
          .animate-snake-border::before,
          .animate-snake-border-outline::before,
          .animate-snake-border-secondary::before {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
