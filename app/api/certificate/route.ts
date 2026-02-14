import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json(
        { error: "Name or email is required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    // Fetch participant with scores by email or name (try exact match first, then partial)
    const searchTerm = search.trim();

    // First try exact match
    let { data: participants, error } = await supabase
      .from("participants")
      .select(
        `
        id,
        name,
        email,
        scores (
          google_dev_badges,
          google_skills_badges,
          social_media_posts,
          total_points
        )
      `,
      )
      .or(`email.eq.${searchTerm},name.eq.${searchTerm}`);

    // If no exact match, try case-insensitive partial match
    if (!participants || participants.length === 0) {
      const result = await supabase
        .from("participants")
        .select(
          `
          id,
          name,
          email,
          scores (
            google_dev_badges,
            google_skills_badges,
            social_media_posts,
            total_points
          )
        `,
        )
        .or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      participants = result.data;
      error = result.error;
    }

    if (error || !participants || participants.length === 0) {
      console.error("Participant search error:", error);
      console.log("Search term:", searchTerm);
      return NextResponse.json(
        {
          error: "Participant not found",
          eligible: false,
          message: "No participant found with this name or email.",
        },
        { status: 404 },
      );
    }

    // If multiple matches, take the first one
    const participantData = participants[0];
    console.log("Found participant:", participantData);

    // Transform data to match expected format
    // scores is an array from Supabase relation, get first element
    const scoresData = participantData.scores?.[0];
    const badges =
      (scoresData?.google_dev_badges || 0) +
      (scoresData?.google_skills_badges || 0);
    const posts = scoresData?.social_media_posts || 0;
    const points = scoresData?.total_points || 0;

    // Check eligibility: at least 1 badge
    const isEligible = badges >= 1;

    console.log(
      "Badges:",
      badges,
      "Posts:",
      posts,
      "Points:",
      points,
      "Eligible:",
      isEligible,
    );

    const participant = {
      name: participantData.name,
      email: participantData.email,
      badges,
      posts,
      points,
    };

    if (!isEligible) {
      return NextResponse.json(
        {
          eligible: false,
          message: "You need at least 1 badge to qualify for a certificate.",
          participant,
        },
        { status: 200 },
      );
    }

    // Participant is eligible
    return NextResponse.json(
      {
        eligible: true,
        message: "Congratulations! You are eligible for a certificate.",
        participant,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Certificate API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
