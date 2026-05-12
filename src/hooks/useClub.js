import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useClub() {
  const { user } = useAuth()
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [holdings, setHoldings] = useState([])
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchClubData()
  }, [user])

  const fetchClubData = async () => {
    setLoading(true)
    try {
      // Get the user's club membership
      const { data: membership } = await supabase
        .from('club_members')
        .select('club_id, role')
        .eq('user_id', user.id)
        .single()

      if (!membership) { setLoading(false); return }

      // Get club details
      const { data: clubData } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', membership.club_id)
        .single()
      setClub({ ...clubData, myRole: membership.role })

      // Get members
      const { data: membersData } = await supabase
        .from('club_members')
        .select('*, profiles:user_id(full_name, email)')
        .eq('club_id', membership.club_id)
      setMembers(membersData || [])

      // Get holdings
      const { data: holdingsData } = await supabase
        .from('holdings')
        .select('*')
        .eq('club_id', membership.club_id)
      setHoldings(holdingsData || [])

      // Get proposals with vote counts
      const { data: proposalsData } = await supabase
        .from('proposals')
        .select('*, votes(vote)')
        .eq('club_id', membership.club_id)
        .order('created_at', { ascending: false })
      setProposals(proposalsData || [])

    } catch (err) {
      console.error('Error fetching club data:', err)
    }
    setLoading(false)
  }

  const createClub = async (name, monthlyContribution = 50) => {
    const { data, error } = await supabase
      .from('clubs')
      .insert({ name, monthly_contribution: monthlyContribution, created_by: user.id })
      .select()
      .single()

    if (error) return { error }

    // Add creator as admin member
    await supabase.from('club_members').insert({
      club_id: data.id,
      user_id: user.id,
      role: 'admin'
    })

    await fetchClubData()
    return { data }
  }

  const joinClub = async (inviteCode) => {
    const { data: clubData, error } = await supabase
      .from('clubs')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()

    if (error) return { error: { message: 'Invalid invite code' } }

    const { error: joinError } = await supabase
      .from('club_members')
      .insert({ club_id: clubData.id, user_id: user.id, role: 'member' })

    if (joinError) return { error: joinError }
    await fetchClubData()
    return { data: clubData }
  }

  const submitProposal = async (title, description) => {
    if (!club) return { error: { message: 'No club found' } }
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        club_id: club.id,
        proposed_by: user.id,
        title,
        description,
        deadline: deadline.toISOString()
      })
      .select()
      .single()

    if (!error) await fetchClubData()
    return { data, error }
  }

  const castVote = async (proposalId, vote) => {
    const { error } = await supabase
      .from('votes')
      .upsert({ proposal_id: proposalId, user_id: user.id, vote })

    if (!error) await fetchClubData()
    return { error }
  }

  return { club, members, holdings, proposals, loading, createClub, joinClub, submitProposal, castVote, refetch: fetchClubData }
}
