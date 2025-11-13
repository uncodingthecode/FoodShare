import Link from "next/link"
import Navbar from "@/components/navbar"
import { Leaf, Users, TrendingUp, ArrowRight } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Leaf,
      title: "Reduce Food Waste",
      description: "Connect surplus food with those who need it most. Every donation counts.",
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Build stronger communities by supporting local NGOs and food banks.",
    },
    {
      icon: TrendingUp,
      title: "Track Impact",
      description: "Monitor donations, claims, and the real-world impact of your contributions.",
    },
  ]

  const roles = [
    {
      title: "Donors",
      description: "Have surplus food? Share it with NGOs and make a difference.",
      cta: "Become a Donor",
      href: "/register?role=donor",
      color: "bg-primary-light border-primary",
    },
    {
      title: "NGOs",
      description: "Find available food donations and claim them for your beneficiaries.",
      cta: "Join as NGO",
      href: "/register?role=ngo",
      color: "bg-secondary-light border-secondary",
    },
    {
      title: "Volunteers",
      description: "Help coordinate donations and support the food sharing network.",
      cta: "Volunteer Now",
      href: "/register?role=volunteer",
      color: "bg-accent-light border-accent",
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-primary-light via-white to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 animate-fade-in">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Reduce Waste, <span className="text-primary">Feed Communities</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Connect food donors with NGOs to eliminate food wastage and ensure no one goes hungry. Join our mission to
            build a sustainable, compassionate food sharing network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-light transition-all duration-200 active:scale-95"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Why FoodShare?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="card text-center animate-fade-in hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Join as</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className={`card border-2 ${role.color} animate-fade-in hover:shadow-lg transition-all duration-300`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-3">{role.title}</h3>
              <p className="text-muted mb-6">{role.description}</p>
              <Link
                href={role.href}
                className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 hover:shadow-md active:scale-95"
              >
                {role.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 mt-16 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-lg opacity-90">
            Start sharing food, reducing waste, and building a stronger community today.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-primary-light transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Join FoodShare Now
          </Link>
        </div>
      </section>
      </div>
    </>
  )
}
