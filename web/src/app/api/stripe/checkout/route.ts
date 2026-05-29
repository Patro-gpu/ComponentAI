import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PRICES: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_ID_PRO!,
  team: process.env.STRIPE_PRICE_ID_TEAM!,
};

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan") ?? "pro";
  const priceId = PRICES[plan];
  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    metadata: { user_id: user.id },
  });

  return NextResponse.redirect(session.url!);
}
