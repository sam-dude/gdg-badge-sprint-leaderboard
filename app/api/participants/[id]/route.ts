import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET single participant
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("participants")
      .select(
        `
        id,
        name,
        email,
        google_dev_profile_url,
        google_skills_profile_url,
        created_at,
        scores (
          google_dev_badges,
          google_skills_badges,
          social_media_posts,
          total_points,
          last_scraped,
          updated_at
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    const scores = Array.isArray(data.scores) ? data.scores[0] : data.scores;

    const participant = {
      id: data.id,
      name: data.name,
      email: data.email,
      googleDevProfileUrl: data.google_dev_profile_url,
      googleSkillsProfileUrl: data.google_skills_profile_url,
      badges:
        (scores?.google_dev_badges || 0) + (scores?.google_skills_badges || 0),
      posts: scores?.social_media_posts || 0,
      points: scores?.total_points || 0,
      lastScraped: scores?.last_scraped,
      createdAt: data.created_at,
      updatedAt: scores?.updated_at,
    };

    return NextResponse.json({ participant }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update participant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      badges,
      posts,
      googleDevProfileUrl,
      googleSkillsProfileUrl,
    } = body;
    const { id } = await params;

    const supabase = createClient();

    // Update participant
    const { error: participantError } = await supabase
      .from("participants")
      .update({
        name,
        email,
        google_dev_profile_url: googleDevProfileUrl || null,
        google_skills_profile_url: googleSkillsProfileUrl || null,
      })
      .eq("id", id);

    if (participantError) {
      return NextResponse.json(
        { error: participantError.message },
        { status: 500 },
      );
    }

    // Calculate points
    const totalPoints = badges * 5 + posts * 2;

    // Update score
    const { error: scoreError } = await supabase
      .from("scores")
      .update({
        google_dev_badges: Math.floor(badges / 2),
        google_skills_badges: Math.ceil(badges / 2),
        social_media_posts: posts,
        total_points: totalPoints,
        updated_at: new Date().toISOString(),
      })
      .eq("participant_id", id);

    if (scoreError) {
      return NextResponse.json({ error: scoreError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Participant updated successfully",
        participant: { id, name, email, badges, posts, points: totalPoints },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE participant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = createClient();
    const { id } = await params;

    // Delete participant (cascade will delete score)
    const { error } = await supabase.from("participants").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Participant deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting participant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
