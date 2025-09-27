"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Music, Video, Download, Users, Guitar, Piano, Mic, Headphones, FileText, Award, Clock, Star, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import EnhancedSearch from "@/components/enhanced-search";
import ResourceRating from "@/components/resource-rating";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [displayedResources, setDisplayedResources] = useState(12);

  const resources = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Gospel Chord Theory Guide",
      description: "Master the fundamentals of gospel chord theory with this comprehensive guide. Learn chord construction, progressions, and gospel music theory essentials. Covers major and minor chords, suspended chords, extended chords, chord inversions, and essential worship chord progressions. Includes practical applications for guitar, piano, and vocalists with real-world examples and exercises.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "1,234",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      rating: 4.8,
      totalRatings: 156,
      overview: "This comprehensive guide covers the essential chord theory concepts every worship musician needs to know. From basic triads to complex extended chords, you'll learn how to construct, voice, and apply chords in gospel and worship music contexts.",
      content: "The guide includes detailed explanations of chord construction, interval relationships, chord symbols, Nashville notation, and practical voicing techniques. Learn about major and minor triads, seventh chords, suspended chords, extended chords (9th, 11th, 13th), altered chords, and slash chords. Master chord inversions and voice leading principles for smooth progressions.",
      exercises: "Practice exercises include chord construction drills, progression analysis, voice leading exercises, and practical application studies. Work through common gospel progressions like I-IV-V, ii-V-I, and gospel-specific progressions. Includes chord substitution exercises and harmonic analysis practice.",
      examples: "Real-world examples include chord progressions from popular worship songs, gospel standards, and contemporary Christian music. Study chord voicings used by professional gospel pianists and guitarists. Learn to apply theory concepts to actual worship scenarios and song arrangements."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Complete Scales Reference",
      description: "The ultimate scales reference for worship musicians. Covers all major scales, natural minor scales, harmonic minor scales, all seven modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian), major and minor pentatonic scales, major and minor blues scales, diminished scales, whole tone scales, and chromatic scales. Includes fingerings for guitar and piano, interval patterns, and practical applications for worship music.",
      type: "PDF Guide",
      size: "3.1 MB",
      downloads: "2,156",
      category: "Scales",
      author: "Heavenkeys Music Academy",
      rating: 4.6,
      totalRatings: 89,
      overview: "This comprehensive scales reference provides everything you need to master scales for worship music. From foundational major and minor scales to advanced modal scales and pentatonic variations, this guide covers all essential scales used in contemporary worship, gospel, and Christian music.",
      content: "Detailed coverage includes: Major scales (12 keys), Natural minor scales, Harmonic minor scales, Melodic minor scales, All seven diatonic modes with characteristic notes, Major and minor pentatonic scales, Major and minor blues scales, Diminished scales, Whole tone scales, Chromatic scales, Scale formulas and interval patterns, Fingerings for guitar and piano, Scale relationships and applications.",
      exercises: "Practice exercises include: Scale memorization drills, Finger pattern exercises, Scale sequence practice, Modal scale applications, Pentatonic scale improvisation, Blues scale exercises, Scale harmonization studies, Transposition practice, Scale analysis exercises, Worship song scale applications.",
      examples: "Real-world examples include: Scale usage in popular worship songs, Gospel scale applications, Contemporary Christian music examples, Improvisation techniques, Scale-based chord progressions, Modal interchange examples, Pentatonic worship applications, Blues scale worship examples, Scale-based song arrangements."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Complete Chords Dictionary",
      description: "The definitive chord reference for worship musicians. Covers all chord types including triads (major, minor, diminished, augmented), seventh chords (dominant 7th, major 7th, minor 7th, half-diminished), chord extensions (9th, 11th, 13th), altered chords, suspended chords, and slash chords. Includes fingerings for guitar and piano, chord symbols, and practical applications for worship music.",
      type: "PDF Guide",
      size: "4.2 MB",
      downloads: "3,289",
      category: "Chords",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive chord dictionary provides complete coverage of all chord types used in worship and gospel music. From basic triads to complex extended chords, this reference includes fingerings, chord symbols, and practical applications for both guitar and piano players.",
      content: "Complete coverage includes: All major and minor triads, Diminished and augmented triads, Seventh chords (dominant 7th, major 7th, minor 7th, half-diminished, diminished 7th), Extended chords (9th, 11th, 13th), Altered chords (b5, #5, b9, #9, #11, b13), Suspended chords (sus2, sus4), Add chords (add2, add9), Slash chords and inversions, Chord symbols and notation, Fingerings for guitar and piano, Voice leading principles.",
      exercises: "Practice exercises include: Chord construction drills, Chord recognition exercises, Finger pattern practice, Chord progression studies, Voice leading exercises, Chord substitution practice, Inversion exercises, Extended chord applications, Altered chord studies, Worship song chord analysis.",
      examples: "Real-world examples include: Chord progressions from worship songs, Gospel chord applications, Contemporary Christian music examples, Chord voicing techniques, Professional chord arrangements, Worship band applications, Solo piano chord techniques, Guitar chord progressions, Chord substitution examples, Extended chord usage in worship."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Leading Masterclass",
      description: "Master the art of worship leading with this comprehensive video series. Learn advanced worship leading techniques, song flow management, and team leadership skills. Create seamless transitions between songs, master dynamics for emotional peaks and valleys, implement key transitions and tonic pads, manage tempo changes, and lead gospel-centered worship sets. Includes practical tips for team communication, skill development, and digital resource management.",
      type: "Video Series",
      size: "Online",
      downloads: "987",
      category: "Training",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive masterclass covers all aspects of worship leading, from basic principles to advanced techniques. Learn how to lead worship effectively, manage worship teams, and create meaningful worship experiences that connect people with God.",
      content: "Video series includes: Worship leading fundamentals, Song selection and arrangement, Flow and transitions, Dynamics and emotional pacing, Key transitions and modulations, Tonic pads and worship moments, Tempo management, Team communication, Rehearsal techniques, Stage presence and leadership, Worship theology, Contemporary worship styles, Gospel worship techniques, Team building and development.",
      exercises: "Practical exercises include: Worship leading practice sessions, Song flow exercises, Transition practice, Dynamics exercises, Team communication drills, Rehearsal planning exercises, Worship set creation, Key transition practice, Worship moment development, Team building activities, Leadership skill development, Worship theology studies.",
      examples: "Real-world examples include: Worship leading techniques from professional worship leaders, Song flow examples from popular worship songs, Transition techniques from live worship services, Dynamics examples from contemporary worship, Team management case studies, Worship set examples, Gospel worship leading techniques, Contemporary worship applications, Worship moment examples, Team communication examples."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Chord Voicings for Worship",
      description: "Master advanced guitar voicings and strumming patterns for contemporary gospel and worship music. Learn essential contemporary chord voicings including C Major, G Major, E Minor, and E Major. Master fingerings for popular worship progressions, understand chord construction, and develop techniques for creating emotional connections through familiar chord progressions. Includes practical applications for modern worship music.",
      type: "PDF Guide",
      size: "1.8 MB",
      downloads: "765",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers advanced guitar techniques specifically for worship and gospel music. Learn contemporary chord voicings, strumming patterns, and techniques used by professional worship guitarists to create engaging and emotional worship experiences.",
      content: "Comprehensive coverage includes: Contemporary chord voicings for worship, Advanced strumming patterns, Fingerpicking techniques, Chord construction and theory, Worship progression techniques, Capo usage and transposition, Alternate tunings for worship, Dynamics and expression, Worship guitar effects, Acoustic and electric techniques, Gospel guitar styles, Contemporary worship applications, Chord substitution techniques, Voice leading for guitar.",
      exercises: "Practice exercises include: Chord voicing drills, Strumming pattern practice, Fingerpicking exercises, Progression studies, Capo exercises, Alternate tuning practice, Dynamics exercises, Worship song applications, Gospel style exercises, Contemporary worship practice, Chord substitution drills, Voice leading exercises, Worship guitar techniques, Professional voicing studies.",
      examples: "Real-world examples include: Chord voicings from popular worship songs, Strumming patterns from contemporary worship, Fingerpicking examples from gospel music, Progression examples from worship standards, Capo usage in worship songs, Alternate tuning applications, Dynamics examples from live worship, Worship guitar effects usage, Gospel guitar techniques, Contemporary worship applications, Professional worship guitar examples."
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Accompaniment Techniques",
      description: "Master piano accompaniment for worship, gospel, and contemporary styles. Learn common chord progressions like 1-5-6-4 (Axis) and I-V-vi-iii-IV-I-IV-V (Pachelbel's Canon). Master chord extensions (add2, sus4), inversions, syncopated rhythms, and left-hand techniques including open fifths, arpeggios, and step-wise bass movement. Create smooth transitions with common tones and 'floating chord islands' for a heavenly worship atmosphere.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "543",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of piano accompaniment for worship music. Learn advanced techniques used by professional worship pianists to create engaging and supportive accompaniments that enhance worship experiences.",
      content: "Comprehensive coverage includes: Common worship chord progressions, Chord extensions and alterations, Chord inversions and voice leading, Left-hand accompaniment patterns, Right-hand chord voicings, Syncopated rhythm patterns, Arpeggio techniques, Bass line development, Dynamics and expression, Worship piano styles, Gospel piano techniques, Contemporary worship applications, Chord substitution techniques, Transposition methods.",
      exercises: "Practice exercises include: Chord progression studies, Inversion exercises, Arpeggio practice, Bass line development, Rhythm pattern practice, Dynamics exercises, Worship song applications, Gospel style exercises, Contemporary worship practice, Chord substitution drills, Voice leading exercises, Worship piano techniques, Professional accompaniment studies, Transposition practice.",
      examples: "Real-world examples include: Accompaniment patterns from popular worship songs, Chord progressions from gospel music, Piano techniques from contemporary worship, Arpeggio examples from worship standards, Bass line examples from live worship, Dynamics examples from professional worship, Gospel piano techniques, Contemporary worship applications, Worship piano arrangements, Professional accompaniment examples."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Vocal Harmony Guide",
      description: "Master vocal harmonies for worship teams with this comprehensive guide. Learn ear training techniques, basic harmony principles (thirds, fifths), four-part harmony structure (soprano, alto, tenor, bass), and gospel/contemporary style techniques including belting and improvisation. Includes practical exercises for singing with recordings, interval practice, chord practice, and team development strategies for worship ministry.",
      type: "PDF Guide",
      size: "1.1 MB",
      downloads: "321",
      category: "Training",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of vocal harmony for worship teams. Learn how to develop strong vocal harmonies, train your ear, and work effectively as a worship vocal team to create beautiful and engaging worship experiences.",
      content: "Comprehensive coverage includes: Ear training techniques, Basic harmony principles, Four-part harmony structure, Gospel vocal techniques, Contemporary worship styles, Belting and improvisation, Interval recognition, Chord practice, Team development strategies, Worship ministry applications, Vocal warm-up exercises, Harmony arrangement techniques, Worship team dynamics, Professional vocal techniques.",
      exercises: "Practice exercises include: Ear training drills, Interval practice, Harmony exercises, Chord practice, Team singing exercises, Worship song applications, Gospel style exercises, Contemporary worship practice, Vocal warm-up routines, Harmony arrangement practice, Worship team exercises, Professional vocal techniques, Improvisation exercises, Belting practice.",
      examples: "Real-world examples include: Harmony arrangements from popular worship songs, Gospel vocal techniques, Contemporary worship examples, Team singing examples, Worship ministry applications, Professional vocal techniques, Harmony examples from live worship, Gospel worship examples, Contemporary worship applications, Worship team dynamics, Vocal arrangement examples."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Communication Template",
      description: "Professional templates for effective communication and scheduling within your worship team. Includes email templates, scheduling forms, rehearsal planning sheets, and team communication protocols. Streamline your worship team management with proven communication strategies and organizational tools.",
      type: "Document",
      size: "0.5 MB",
      downloads: "456",
      category: "Templates",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive template collection provides everything you need to manage worship team communication effectively. From scheduling to rehearsal planning, these templates will help streamline your worship team operations and improve team dynamics.",
      content: "Template collection includes: Email communication templates, Scheduling and availability forms, Rehearsal planning sheets, Song selection forms, Team meeting agendas, Performance feedback forms, Equipment checklists, Sound check protocols, Worship set planning templates, Team building activities, Conflict resolution guides, Leadership development materials, Ministry planning templates, Worship team policies.",
      exercises: "Practical exercises include: Communication practice sessions, Scheduling exercises, Rehearsal planning practice, Team meeting facilitation, Conflict resolution practice, Leadership development exercises, Ministry planning practice, Team building activities, Worship team management, Communication skill development, Organizational exercises, Team dynamics practice.",
      examples: "Real-world examples include: Worship team communication examples, Scheduling systems from successful churches, Rehearsal planning from professional worship teams, Team meeting examples, Performance feedback examples, Equipment management examples, Sound check protocols, Worship set planning examples, Team building activities, Leadership development examples, Ministry planning examples, Worship team policies."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audio Mixing Basics for Live Sound",
      description: "Master the fundamentals of live sound mixing for church services and worship events. Learn essential mixing techniques, equipment setup, sound system optimization, and troubleshooting. Perfect for worship teams, sound engineers, and church technical volunteers who want to improve their live sound mixing skills.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "678",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video tutorial covers all the essential aspects of live sound mixing for worship services. Learn professional techniques used by experienced sound engineers to create clear, balanced, and engaging audio experiences for worship.",
      content: "Video tutorial includes: Sound system fundamentals, Mixing console operation, Microphone techniques, Monitor mixing, Main house mixing, EQ and dynamics processing, Effects and processing, Sound system setup, Troubleshooting common issues, Worship-specific mixing techniques, Gospel music mixing, Contemporary worship applications, Sound check protocols, Live recording basics.",
      exercises: "Practical exercises include: Mixing practice sessions, Sound system setup exercises, Microphone placement practice, EQ exercises, Dynamics processing practice, Effects usage exercises, Troubleshooting practice, Worship song mixing exercises, Gospel music mixing practice, Contemporary worship applications, Sound check exercises, Live recording practice, Professional mixing techniques.",
      examples: "Real-world examples include: Mixing techniques from professional worship services, Sound system setups from successful churches, Microphone techniques from live worship, EQ examples from worship music, Dynamics processing examples, Effects usage in worship, Sound check protocols, Live recording examples, Gospel music mixing examples, Contemporary worship applications, Professional sound engineering examples."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Gospel Music History & Culture",
      description: "Explore the rich history and cultural significance of gospel music. Learn about the origins, evolution, and impact of gospel music on worship and contemporary Christian music. Discover the stories behind legendary gospel artists, influential songs, and the cultural movements that shaped gospel music into what it is today.",
      type: "PDF Guide",
      size: "5.2 MB",
      downloads: "892",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide explores the rich history and cultural significance of gospel music. Learn about the origins, evolution, and impact of gospel music on worship and contemporary Christian music, and discover the stories behind legendary gospel artists and influential songs.",
      content: "Comprehensive coverage includes: Origins of gospel music, African American spiritual traditions, Gospel music evolution, Influential gospel artists, Gospel music styles and genres, Cultural impact of gospel music, Gospel music in worship, Contemporary gospel developments, Gospel music in popular culture, Gospel music education, Gospel music ministry, Gospel music performance, Gospel music recording, Gospel music industry.",
      exercises: "Study exercises include: Historical research projects, Gospel music analysis, Cultural impact studies, Gospel artist research, Gospel song analysis, Gospel music style studies, Gospel music influence research, Gospel music education projects, Gospel music ministry studies, Gospel music performance analysis, Gospel music recording studies, Gospel music industry research.",
      examples: "Real-world examples include: Historical gospel songs, Influential gospel artists, Gospel music styles, Gospel music in worship, Contemporary gospel examples, Gospel music cultural impact, Gospel music education examples, Gospel music ministry examples, Gospel music performance examples, Gospel music recording examples, Gospel music industry examples."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Advanced Chord Substitutions",
      description: "Master sophisticated chord substitution techniques for gospel and worship music. Learn advanced harmonic concepts, tritone substitutions, secondary dominants, and complex chord progressions. Develop your harmonic vocabulary and create more interesting and sophisticated worship arrangements.",
      type: "PDF Guide",
      size: "2.8 MB",
      downloads: "1,456",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      overview: "This advanced guide covers sophisticated chord substitution techniques used in gospel and worship music. Learn how to create more interesting and complex harmonic progressions while maintaining the worshipful and accessible nature of the music.",
      content: "Advanced coverage includes: Tritone substitutions, Secondary dominants, Extended chord substitutions, Altered chord substitutions, Modal interchange, Borrowed chords, Chromatic harmony, Voice leading principles, Advanced chord progressions, Gospel-specific substitutions, Contemporary worship applications, Jazz-influenced substitutions, Classical harmony applications, Modern worship techniques.",
      exercises: "Advanced exercises include: Chord substitution drills, Harmonic analysis exercises, Voice leading practice, Progression studies, Gospel substitution exercises, Contemporary worship applications, Jazz-influenced practice, Classical harmony studies, Modern worship techniques, Professional substitution examples, Advanced harmonic concepts, Complex progression studies.",
      examples: "Real-world examples include: Advanced substitutions from gospel music, Contemporary worship applications, Jazz-influenced worship examples, Classical harmony in worship, Modern worship techniques, Professional substitution examples, Gospel music harmonic concepts, Contemporary worship progressions, Advanced harmonic examples, Complex worship arrangements."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Contemporary Gospel Arranging",
      description: "Master the art of arranging gospel songs for different ensemble sizes and worship contexts. Learn professional arranging techniques, instrumentation choices, vocal arrangements, and how to adapt gospel songs for various worship settings. Perfect for worship leaders, music directors, and gospel musicians.",
      type: "Video Course",
      size: "Online",
      downloads: "734",
      category: "Training",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video course covers all aspects of arranging gospel songs for worship. Learn professional techniques used by experienced gospel arrangers to create engaging and worshipful arrangements for various ensemble sizes and worship contexts.",
      content: "Video course includes: Arranging fundamentals, Instrumentation choices, Vocal arrangements, Ensemble size considerations, Worship context adaptations, Gospel style techniques, Contemporary worship applications, Professional arranging methods, Score preparation, Rehearsal techniques, Performance considerations, Recording arrangements, Live worship applications, Gospel music education.",
      exercises: "Practical exercises include: Arranging practice sessions, Instrumentation exercises, Vocal arrangement practice, Ensemble size studies, Worship context adaptations, Gospel style exercises, Contemporary worship applications, Professional arranging methods, Score preparation, Rehearsal techniques, Performance practice, Recording exercises, Live worship applications, Gospel music education projects.",
      examples: "Real-world examples include: Arrangements from professional gospel musicians, Instrumentation examples from worship teams, Vocal arrangements from gospel choirs, Ensemble size examples from worship services, Worship context adaptations, Gospel style examples, Contemporary worship applications, Professional arranging examples, Score examples, Rehearsal techniques, Performance examples, Recording examples, Live worship applications."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Fingerpicking Patterns for Gospel",
      description: "Master essential fingerpicking patterns and techniques for acoustic gospel guitar. Learn traditional gospel fingerpicking styles, contemporary worship applications, and how to create beautiful acoustic arrangements for worship songs. Perfect for acoustic guitarists in worship teams.",
      type: "PDF Guide",
      size: "1.5 MB",
      downloads: "623",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all essential fingerpicking patterns and techniques for acoustic gospel guitar. Learn traditional gospel styles, contemporary worship applications, and how to create beautiful acoustic arrangements for worship songs.",
      content: "Comprehensive coverage includes: Traditional gospel fingerpicking, Contemporary worship applications, Acoustic arrangement techniques, Fingerpicking patterns, Gospel guitar styles, Worship song arrangements, Acoustic guitar techniques, Gospel music applications, Contemporary worship styles, Professional fingerpicking techniques, Gospel guitar education, Worship guitar applications, Acoustic worship examples, Gospel guitar performance.",
      exercises: "Practice exercises include: Fingerpicking pattern drills, Gospel style exercises, Contemporary worship applications, Acoustic arrangement practice, Fingerpicking technique studies, Gospel guitar exercises, Worship song arrangements, Acoustic guitar practice, Gospel music applications, Contemporary worship practice, Professional fingerpicking techniques, Gospel guitar education, Worship guitar applications, Acoustic worship examples.",
      examples: "Real-world examples include: Fingerpicking patterns from gospel music, Contemporary worship applications, Acoustic arrangements from worship songs, Gospel guitar techniques, Worship song examples, Acoustic guitar examples, Gospel music applications, Contemporary worship examples, Professional fingerpicking examples, Gospel guitar education examples, Worship guitar applications, Acoustic worship examples, Gospel guitar performance examples."
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Gospel Piano Styles Collection",
      description: "Master comprehensive gospel piano styles and techniques with this extensive video series. Learn traditional gospel piano styles, contemporary worship applications, and how to create authentic gospel piano arrangements. Perfect for pianists in worship teams and gospel musicians.",
      type: "Video Series",
      size: "Online",
      downloads: "1,234",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video series covers all essential gospel piano styles and techniques. Learn traditional gospel styles, contemporary worship applications, and how to create authentic gospel piano arrangements for worship and performance.",
      content: "Video series includes: Traditional gospel piano styles, Contemporary worship applications, Gospel piano techniques, Worship song arrangements, Gospel music applications, Contemporary worship styles, Professional gospel piano techniques, Gospel piano education, Worship piano applications, Gospel piano performance, Gospel piano recording, Gospel piano ministry, Gospel piano examples, Gospel piano education.",
      exercises: "Practice exercises include: Gospel piano style drills, Contemporary worship applications, Gospel piano technique studies, Worship song arrangements, Gospel music applications, Contemporary worship practice, Professional gospel piano techniques, Gospel piano education, Worship piano applications, Gospel piano performance, Gospel piano recording, Gospel piano ministry, Gospel piano examples, Gospel piano education projects.",
      examples: "Real-world examples include: Gospel piano styles from traditional gospel music, Contemporary worship applications, Gospel piano techniques from professional musicians, Worship song arrangements, Gospel music applications, Contemporary worship examples, Professional gospel piano techniques, Gospel piano education examples, Worship piano applications, Gospel piano performance examples, Gospel piano recording examples, Gospel piano ministry examples."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Vocal Warm-up Exercises",
      description: "Master professional vocal warm-up routines for worship singers. Learn essential vocal exercises, breathing techniques, and warm-up routines used by professional worship vocalists. Perfect for worship team vocalists, soloists, and gospel singers.",
      type: "Audio Guide",
      size: "25 min",
      downloads: "2,156",
      category: "Training",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive audio guide covers all essential vocal warm-up routines for worship singers. Learn professional techniques used by experienced worship vocalists to prepare their voices for worship and performance.",
      content: "Audio guide includes: Professional vocal warm-up routines, Breathing techniques, Vocal exercises, Worship-specific warm-ups, Gospel vocal techniques, Contemporary worship applications, Vocal health tips, Professional vocal techniques, Worship vocal education, Gospel vocal applications, Contemporary worship styles, Professional vocal performance, Gospel vocal ministry, Worship vocal examples.",
      exercises: "Practice exercises include: Vocal warm-up drills, Breathing exercises, Vocal technique studies, Worship-specific warm-ups, Gospel vocal exercises, Contemporary worship applications, Vocal health practice, Professional vocal techniques, Worship vocal education, Gospel vocal applications, Contemporary worship practice, Professional vocal performance, Gospel vocal ministry, Worship vocal examples.",
      examples: "Real-world examples include: Vocal warm-up routines from professional worship vocalists, Breathing techniques from gospel singers, Vocal exercises from contemporary worship, Worship-specific warm-ups from worship teams, Gospel vocal techniques from professional musicians, Contemporary worship applications, Vocal health examples, Professional vocal techniques, Worship vocal education examples, Gospel vocal applications, Contemporary worship examples, Professional vocal performance examples, Gospel vocal ministry examples."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Leadership Guide",
      description: "Master the art of leading and managing worship teams effectively. Learn essential leadership skills, team management techniques, and how to build strong worship teams. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "3.4 MB",
      downloads: "789",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of worship team leadership. Learn essential leadership skills, team management techniques, and how to build strong worship teams that serve effectively in worship ministry.",
      content: "Comprehensive coverage includes: Worship team leadership fundamentals, Team management techniques, Leadership development, Worship ministry management, Team building strategies, Worship team dynamics, Leadership communication, Worship team training, Ministry leadership, Worship team development, Professional leadership techniques, Worship ministry applications, Gospel worship leadership, Contemporary worship management.",
      exercises: "Leadership exercises include: Worship team leadership practice, Team management exercises, Leadership development activities, Worship ministry management, Team building exercises, Worship team dynamics practice, Leadership communication exercises, Worship team training, Ministry leadership practice, Worship team development, Professional leadership techniques, Worship ministry applications, Gospel worship leadership, Contemporary worship management.",
      examples: "Real-world examples include: Worship team leadership from successful churches, Team management examples from worship teams, Leadership development examples, Worship ministry management examples, Team building examples, Worship team dynamics examples, Leadership communication examples, Worship team training examples, Ministry leadership examples, Worship team development examples, Professional leadership techniques, Worship ministry applications, Gospel worship leadership examples, Contemporary worship management examples."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Sound System Setup Guide",
      description: "Master the art of setting up sound systems for church services. Learn essential audio engineering skills, sound system configuration, and how to achieve professional sound quality in worship settings. Perfect for sound engineers, worship leaders, and church technical teams.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "567",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of sound system setup for worship services. Learn essential audio engineering skills, sound system configuration, and how to achieve professional sound quality in worship settings.",
      content: "Comprehensive coverage includes: Sound system fundamentals, Audio engineering basics, Sound system configuration, Worship sound techniques, Professional sound quality, Sound system troubleshooting, Worship sound applications, Gospel sound techniques, Contemporary worship sound, Sound system management, Worship sound education, Gospel sound applications, Contemporary worship applications, Professional sound examples.",
      exercises: "Practice exercises include: Sound system setup drills, Audio engineering exercises, Sound system configuration practice, Worship sound techniques, Professional sound quality practice, Sound system troubleshooting, Worship sound applications, Gospel sound techniques, Contemporary worship sound, Sound system management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional sound examples.",
      examples: "Real-world examples include: Sound system setups from professional worship venues, Audio engineering examples from worship services, Sound system configuration examples, Worship sound techniques from live services, Professional sound quality examples, Sound system troubleshooting examples, Worship sound applications, Gospel sound techniques, Contemporary worship sound examples, Sound system management examples, Worship sound education examples, Gospel sound applications, Contemporary worship examples, Professional sound examples."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Song Copyright Guidelines",
      description: "Master the art of understanding copyright laws and licensing for worship music. Learn essential legal knowledge, copyright compliance, and how to navigate the complex world of music licensing in worship settings. Perfect for worship leaders, church administrators, and music directors.",
      type: "Document",
      size: "0.8 MB",
      downloads: "1,234",
      category: "Legal",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of copyright laws and licensing for worship music. Learn essential legal knowledge, copyright compliance, and how to navigate the complex world of music licensing in worship settings.",
      content: "Comprehensive coverage includes: Copyright law fundamentals, Music licensing basics, Worship music licensing, Copyright compliance, Music licensing applications, Gospel music licensing, Contemporary worship licensing, Music licensing management, Worship music education, Gospel music applications, Contemporary worship applications, Professional music licensing, Gospel music examples, Contemporary worship examples.",
      exercises: "Practice exercises include: Copyright law studies, Music licensing exercises, Worship music licensing practice, Copyright compliance exercises, Music licensing applications, Gospel music licensing, Contemporary worship licensing, Music licensing management, Worship music education, Gospel music applications, Contemporary worship practice, Professional music licensing, Gospel music examples, Contemporary worship examples.",
      examples: "Real-world examples include: Copyright law examples from worship music, Music licensing examples from worship services, Worship music licensing examples, Copyright compliance examples, Music licensing applications, Gospel music licensing examples, Contemporary worship licensing examples, Music licensing management examples, Worship music education examples, Gospel music applications, Contemporary worship examples, Professional music licensing examples, Gospel music examples, Contemporary worship examples."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Worship Ministry Certification",
      description: "Master the art of worship ministry leadership with our comprehensive certification program. Learn essential worship ministry skills, leadership techniques, and how to build strong worship ministries. Perfect for worship leaders, music directors, and church leaders.",
      type: "Course",
      size: "Online",
      downloads: "456",
      category: "Certification",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive certification program covers all aspects of worship ministry leadership. Learn essential worship ministry skills, leadership techniques, and how to build strong worship ministries that serve effectively in worship ministry.",
      content: "Comprehensive coverage includes: Worship ministry fundamentals, Leadership development, Worship ministry management, Team building strategies, Worship ministry dynamics, Leadership communication, Worship ministry training, Ministry leadership, Worship ministry development, Professional leadership techniques, Worship ministry applications, Gospel worship leadership, Contemporary worship management, Professional worship ministry examples.",
      exercises: "Certification exercises include: Worship ministry leadership practice, Team management exercises, Leadership development activities, Worship ministry management, Team building exercises, Worship ministry dynamics practice, Leadership communication exercises, Worship ministry training, Ministry leadership practice, Worship ministry development, Professional leadership techniques, Worship ministry applications, Gospel worship leadership, Contemporary worship management, Professional worship ministry examples.",
      examples: "Real-world examples include: Worship ministry leadership from successful churches, Team management examples from worship ministries, Leadership development examples, Worship ministry management examples, Team building examples, Worship ministry dynamics examples, Leadership communication examples, Worship ministry training examples, Ministry leadership examples, Worship ministry development examples, Professional leadership techniques, Worship ministry applications, Gospel worship leadership examples, Contemporary worship management examples, Professional worship ministry examples."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Service Planning Templates",
      description: "Master the art of planning worship services and special events with our comprehensive templates. Learn essential service planning skills, event management techniques, and how to create meaningful worship experiences. Perfect for worship leaders, event planners, and church administrators.",
      type: "Document",
      size: "1.2 MB",
      downloads: "678",
      category: "Templates",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of service planning for worship services and special events. Learn essential service planning skills, event management techniques, and how to create meaningful worship experiences.",
      content: "Comprehensive coverage includes: Service planning fundamentals, Event management basics, Worship service planning, Service planning applications, Gospel service planning, Contemporary worship planning, Service planning management, Worship service education, Gospel service applications, Contemporary worship applications, Professional service planning, Gospel service examples, Contemporary worship examples, Professional service planning examples.",
      exercises: "Planning exercises include: Service planning drills, Event management exercises, Worship service planning practice, Service planning applications, Gospel service planning, Contemporary worship planning, Service planning management, Worship service education, Gospel service applications, Contemporary worship practice, Professional service planning, Gospel service examples, Contemporary worship examples, Professional service planning examples.",
      examples: "Real-world examples include: Service planning examples from successful worship services, Event management examples from worship events, Worship service planning examples, Service planning applications, Gospel service planning examples, Contemporary worship planning examples, Service planning management examples, Worship service education examples, Gospel service applications, Contemporary worship examples, Professional service planning examples, Gospel service examples, Contemporary worship examples, Professional service planning examples."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Chord Progressions Library",
      description: "Master the art of gospel chord progressions with our comprehensive library. Learn essential gospel chord progressions, chord substitution techniques, and how to create authentic gospel sounds. Perfect for gospel musicians, worship leaders, and church musicians.",
      type: "PDF Guide",
      size: "4.7 MB",
      downloads: "2,345",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive library covers all essential gospel chord progressions used in contemporary gospel music. Learn chord substitution techniques, voice leading principles, and how to create authentic gospel sounds that connect with congregations.",
      content: "Comprehensive coverage includes: Gospel chord progression fundamentals, Chord substitution techniques, Voice leading principles, Gospel chord progressions, Chord progression applications, Gospel music theory, Contemporary gospel progressions, Gospel chord progressions, Gospel music education, Gospel chord applications, Contemporary gospel applications, Professional gospel progressions, Gospel chord examples, Contemporary gospel examples, Professional gospel progressions examples.",
      exercises: "Practice exercises include: Gospel chord progression drills, Chord substitution exercises, Voice leading practice, Gospel chord progressions, Chord progression applications, Gospel music theory exercises, Contemporary gospel progressions, Gospel chord progressions, Gospel music education, Gospel chord applications, Contemporary gospel practice, Professional gospel progressions, Gospel chord examples, Contemporary gospel examples, Professional gospel progressions examples.",
      examples: "Real-world examples include: Gospel chord progressions from popular gospel songs, Chord substitution examples from gospel music, Voice leading examples from gospel arrangements, Gospel chord progressions from gospel standards, Chord progression applications from gospel worship, Gospel music theory examples, Contemporary gospel progressions from gospel artists, Gospel chord progressions from gospel bands, Gospel music education examples, Gospel chord applications from gospel choirs, Contemporary gospel examples from gospel worship, Professional gospel progressions from gospel musicians, Gospel chord examples from gospel recordings, Contemporary gospel examples from gospel performances, Professional gospel progressions examples from gospel professionals."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Live Worship Recording Techniques",
      description: "Master the art of recording live worship services with professional techniques. Learn essential recording skills, audio engineering, and how to capture the energy and emotion of live worship. Perfect for sound engineers, worship leaders, and church technical teams.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "567",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video tutorial covers all aspects of recording live worship services. Learn professional recording techniques, audio engineering skills, and how to capture the energy and emotion of live worship.",
      content: "Comprehensive coverage includes: Live recording fundamentals, Audio engineering basics, Worship recording techniques, Professional recording applications, Gospel recording techniques, Contemporary worship recording, Recording management, Worship recording education, Gospel recording applications, Contemporary worship applications, Professional recording examples, Gospel recording examples, Contemporary worship examples, Professional recording examples.",
      exercises: "Recording exercises include: Live recording drills, Audio engineering exercises, Worship recording practice, Professional recording applications, Gospel recording techniques, Contemporary worship recording, Recording management, Worship recording education, Gospel recording applications, Contemporary worship practice, Professional recording examples, Gospel recording examples, Contemporary worship examples, Professional recording examples.",
      examples: "Real-world examples include: Live recording examples from worship services, Audio engineering examples from worship recordings, Worship recording techniques from live worship, Professional recording applications from worship venues, Gospel recording techniques from gospel services, Contemporary worship recording from worship teams, Recording management examples from worship studios, Worship recording education examples from worship schools, Gospel recording applications from gospel choirs, Contemporary worship examples from worship bands, Professional recording examples from worship professionals, Gospel recording examples from gospel artists, Contemporary worship examples from worship leaders, Professional recording examples from worship engineers."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Electric Guitar for Worship",
      description: "Master the art of using electric guitar in contemporary worship settings. Learn essential electric guitar techniques, worship guitar skills, and how to create engaging worship experiences. Perfect for worship guitarists, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "789",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of using electric guitar in contemporary worship settings. Learn essential electric guitar techniques, worship guitar skills, and how to create engaging worship experiences.",
      content: "Comprehensive coverage includes: Electric guitar fundamentals, Worship guitar techniques, Contemporary worship guitar, Electric guitar applications, Gospel guitar techniques, Contemporary worship applications, Electric guitar management, Worship guitar education, Gospel guitar applications, Contemporary worship practice, Professional electric guitar, Gospel guitar examples, Contemporary worship examples, Professional electric guitar examples.",
      exercises: "Practice exercises include: Electric guitar drills, Worship guitar techniques, Contemporary worship guitar practice, Electric guitar applications, Gospel guitar techniques, Contemporary worship applications, Electric guitar management, Worship guitar education, Gospel guitar applications, Contemporary worship practice, Professional electric guitar, Gospel guitar examples, Contemporary worship examples, Professional electric guitar examples.",
      examples: "Real-world examples include: Electric guitar examples from worship services, Worship guitar techniques from worship teams, Contemporary worship guitar from worship bands, Electric guitar applications from worship venues, Gospel guitar techniques from gospel services, Contemporary worship applications from worship leaders, Electric guitar management from worship studios, Worship guitar education from worship schools, Gospel guitar applications from gospel choirs, Contemporary worship examples from worship musicians, Professional electric guitar from worship professionals, Gospel guitar examples from gospel artists, Contemporary worship examples from worship guitarists, Professional electric guitar examples from worship engineers."
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Keyboard Programming for Worship",
      description: "Master the art of programming keyboards and synthesizers for worship music. Learn essential keyboard programming techniques, worship keyboard skills, and how to create engaging worship experiences. Perfect for worship keyboardists, church musicians, and worship leaders.",
      type: "Video Course",
      size: "Online",
      downloads: "456",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video course covers all aspects of programming keyboards and synthesizers for worship music. Learn essential keyboard programming techniques, worship keyboard skills, and how to create engaging worship experiences.",
      content: "Comprehensive coverage includes: Keyboard programming fundamentals, Worship keyboard techniques, Contemporary worship keyboard, Keyboard programming applications, Gospel keyboard techniques, Contemporary worship applications, Keyboard programming management, Worship keyboard education, Gospel keyboard applications, Contemporary worship practice, Professional keyboard programming, Gospel keyboard examples, Contemporary worship examples, Professional keyboard programming examples.",
      exercises: "Programming exercises include: Keyboard programming drills, Worship keyboard techniques, Contemporary worship keyboard practice, Keyboard programming applications, Gospel keyboard techniques, Contemporary worship applications, Keyboard programming management, Worship keyboard education, Gospel keyboard applications, Contemporary worship practice, Professional keyboard programming, Gospel keyboard examples, Contemporary worship examples, Professional keyboard programming examples.",
      examples: "Real-world examples include: Keyboard programming examples from worship services, Worship keyboard techniques from worship teams, Contemporary worship keyboard from worship bands, Keyboard programming applications from worship venues, Gospel keyboard techniques from gospel services, Contemporary worship applications from worship leaders, Keyboard programming management from worship studios, Worship keyboard education from worship schools, Gospel keyboard applications from gospel choirs, Contemporary worship examples from worship musicians, Professional keyboard programming from worship professionals, Gospel keyboard examples from gospel artists, Contemporary worship examples from worship keyboardists, Professional keyboard programming examples from worship engineers."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Microphone Techniques for Worship",
      description: "Master the art of professional microphone techniques for worship singers and speakers. Learn essential microphone skills, worship sound techniques, and how to achieve professional sound quality. Perfect for worship singers, speakers, and sound engineers.",
      type: "PDF Guide",
      size: "1.9 MB",
      downloads: "623",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of professional microphone techniques for worship singers and speakers. Learn essential microphone skills, worship sound techniques, and how to achieve professional sound quality.",
      content: "Comprehensive coverage includes: Microphone fundamentals, Worship sound techniques, Professional microphone applications, Gospel microphone techniques, Contemporary worship applications, Microphone management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional microphone examples, Gospel sound examples, Contemporary worship examples, Professional microphone examples.",
      exercises: "Microphone exercises include: Microphone technique drills, Worship sound practice, Professional microphone applications, Gospel microphone techniques, Contemporary worship applications, Microphone management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional microphone examples, Gospel sound examples, Contemporary worship examples, Professional microphone examples.",
      examples: "Real-world examples include: Microphone techniques from worship services, Worship sound examples from worship teams, Professional microphone applications from worship venues, Gospel microphone techniques from gospel services, Contemporary worship applications from worship leaders, Microphone management from worship studios, Worship sound education from worship schools, Gospel sound applications from gospel choirs, Contemporary worship examples from worship musicians, Professional microphone examples from worship professionals, Gospel sound examples from gospel artists, Contemporary worship examples from worship singers, Professional microphone examples from worship engineers."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Building Worship Teams",
      description: "Master the art of building worship teams with comprehensive strategies. Learn essential team building skills, worship team management, and how to create strong worship teams. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "2.6 MB",
      downloads: "1,123",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of building worship teams. Learn essential team building skills, worship team management, and how to create strong worship teams that serve effectively in worship ministry.",
      content: "Comprehensive coverage includes: Worship team building fundamentals, Team management techniques, Worship team development, Team building strategies, Worship team dynamics, Team building communication, Worship team training, Ministry team building, Worship team development, Professional team building, Worship ministry applications, Gospel team building, Contemporary worship team building, Professional worship team examples.",
      exercises: "Team building exercises include: Worship team building practice, Team management exercises, Worship team development activities, Team building strategies, Worship team dynamics practice, Team building communication exercises, Worship team training, Ministry team building practice, Worship team development, Professional team building, Worship ministry applications, Gospel team building, Contemporary worship team building, Professional worship team examples.",
      examples: "Real-world examples include: Worship team building from successful churches, Team management examples from worship teams, Worship team development examples, Team building strategies from worship ministries, Worship team dynamics examples, Team building communication examples, Worship team training examples, Ministry team building examples, Worship team development examples, Professional team building examples, Worship ministry applications, Gospel team building examples, Contemporary worship team building examples, Professional worship team examples."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "In-Ear Monitor Setup",
      description: "Master the art of setting up in-ear monitoring systems for worship. Learn essential monitoring techniques, worship sound management, and how to achieve professional monitoring quality. Perfect for sound engineers, worship leaders, and church technical teams.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "345",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video tutorial covers all aspects of setting up in-ear monitoring systems for worship. Learn essential monitoring techniques, worship sound management, and how to achieve professional monitoring quality.",
      content: "Comprehensive coverage includes: In-ear monitoring fundamentals, Worship sound management, Professional monitoring applications, Gospel monitoring techniques, Contemporary worship applications, Monitoring management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional monitoring examples, Gospel sound examples, Contemporary worship examples, Professional monitoring examples.",
      exercises: "Monitoring exercises include: In-ear monitoring drills, Worship sound management practice, Professional monitoring applications, Gospel monitoring techniques, Contemporary worship applications, Monitoring management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional monitoring examples, Gospel sound examples, Contemporary worship examples, Professional monitoring examples.",
      examples: "Real-world examples include: In-ear monitoring examples from worship services, Worship sound management from worship teams, Professional monitoring applications from worship venues, Gospel monitoring techniques from gospel services, Contemporary worship applications from worship leaders, Monitoring management from worship studios, Worship sound education from worship schools, Gospel sound applications from gospel choirs, Contemporary worship examples from worship musicians, Professional monitoring examples from worship professionals, Gospel sound examples from gospel artists, Contemporary worship examples from worship singers, Professional monitoring examples from worship engineers."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Worship Song Database Template",
      description: "Master the art of organizing and cataloging your worship song library with our comprehensive template. Learn essential database management skills, worship song organization, and how to create efficient worship song libraries. Perfect for worship leaders, music directors, and church administrators.",
      type: "Document",
      size: "0.3 MB",
      downloads: "789",
      category: "Templates",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive template covers all aspects of organizing and cataloging worship song libraries. Learn essential database management skills, worship song organization, and how to create efficient worship song libraries.",
      content: "Comprehensive coverage includes: Worship song database fundamentals, Database management basics, Worship song organization, Database management applications, Gospel song database, Contemporary worship database, Database management, Worship song education, Gospel song applications, Contemporary worship applications, Professional database management, Gospel song examples, Contemporary worship examples, Professional database examples.",
      exercises: "Database exercises include: Worship song database drills, Database management practice, Worship song organization practice, Database management applications, Gospel song database, Contemporary worship database, Database management, Worship song education, Gospel song applications, Contemporary worship practice, Professional database management, Gospel song examples, Contemporary worship examples, Professional database examples.",
      examples: "Real-world examples include: Worship song database examples from worship services, Database management examples from worship teams, Worship song organization examples, Database management applications from worship venues, Gospel song database examples from gospel services, Contemporary worship database examples from worship leaders, Database management examples from worship studios, Worship song education examples from worship schools, Gospel song applications from gospel choirs, Contemporary worship examples from worship musicians, Professional database management examples from worship professionals, Gospel song examples from gospel artists, Contemporary worship examples from worship singers, Professional database examples from worship engineers."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Music Theory Fundamentals",
      description: "Master the art of music theory with our comprehensive fundamentals guide. Learn essential music theory concepts, worship music theory, and how to apply theory to worship music. Perfect for worship musicians, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "3.8 MB",
      downloads: "1,567",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all essential music theory concepts for worship musicians. Learn essential music theory concepts, worship music theory, and how to apply theory to worship music.",
      content: "Comprehensive coverage includes: Music theory fundamentals, Worship music theory, Contemporary worship theory, Music theory applications, Gospel music theory, Contemporary worship applications, Music theory management, Worship music education, Gospel music applications, Contemporary worship practice, Professional music theory, Gospel music examples, Contemporary worship examples, Professional music theory examples.",
      exercises: "Theory exercises include: Music theory drills, Worship music theory practice, Contemporary worship theory practice, Music theory applications, Gospel music theory, Contemporary worship applications, Music theory management, Worship music education, Gospel music applications, Contemporary worship practice, Professional music theory, Gospel music examples, Contemporary worship examples, Professional music theory examples.",
      examples: "Real-world examples include: Music theory examples from worship services, Worship music theory from worship teams, Contemporary worship theory from worship bands, Music theory applications from worship venues, Gospel music theory from gospel services, Contemporary worship applications from worship leaders, Music theory management from worship studios, Worship music education from worship schools, Gospel music applications from gospel choirs, Contemporary worship examples from worship musicians, Professional music theory from worship professionals, Gospel music examples from gospel artists, Contemporary worship examples from worship singers, Professional music theory examples from worship engineers."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Rehearsal Planning Guide",
      description: "Master the art of planning and conducting worship team rehearsals with our comprehensive guide. Learn essential rehearsal planning skills, worship team management, and how to create effective worship rehearsals. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "1.7 MB",
      downloads: "456",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of planning and conducting worship team rehearsals. Learn essential rehearsal planning skills, worship team management, and how to create effective worship rehearsals.",
      content: "Comprehensive coverage includes: Rehearsal planning fundamentals, Worship team management, Rehearsal planning applications, Gospel rehearsal planning, Contemporary worship rehearsals, Rehearsal management, Worship team education, Gospel team applications, Contemporary worship practice, Professional rehearsal planning, Gospel team examples, Contemporary worship examples, Professional rehearsal examples.",
      exercises: "Rehearsal exercises include: Rehearsal planning drills, Worship team management practice, Rehearsal planning applications, Gospel rehearsal planning, Contemporary worship rehearsals, Rehearsal management, Worship team education, Gospel team applications, Contemporary worship practice, Professional rehearsal planning, Gospel team examples, Contemporary worship examples, Professional rehearsal examples.",
      examples: "Real-world examples include: Rehearsal planning examples from worship services, Worship team management from worship teams, Rehearsal planning applications from worship venues, Gospel rehearsal planning from gospel services, Contemporary worship rehearsals from worship leaders, Rehearsal management from worship studios, Worship team education from worship schools, Gospel team applications from gospel choirs, Contemporary worship examples from worship musicians, Professional rehearsal planning from worship professionals, Gospel team examples from gospel artists, Contemporary worship examples from worship singers, Professional rehearsal examples from worship engineers."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Notation Guide",
      description: "Master the art of reading and writing gospel music notation with our comprehensive guide. Learn essential notation skills, gospel music theory, and how to apply notation to gospel music. Perfect for gospel musicians, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "2.9 MB",
      downloads: "678",
      category: "Theory",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of reading and writing gospel music notation. Learn essential notation skills, gospel music theory, and how to apply notation to gospel music.",
      content: "Comprehensive coverage includes: Gospel music notation fundamentals, Notation skills, Gospel music theory, Notation applications, Gospel music notation, Contemporary gospel notation, Notation management, Gospel music education, Gospel notation applications, Contemporary gospel practice, Professional gospel notation, Gospel music examples, Contemporary gospel examples, Professional gospel notation examples.",
      exercises: "Notation exercises include: Gospel music notation drills, Notation skills practice, Gospel music theory practice, Notation applications, Gospel music notation, Contemporary gospel notation, Notation management, Gospel music education, Gospel notation applications, Contemporary gospel practice, Professional gospel notation, Gospel music examples, Contemporary gospel examples, Professional gospel notation examples.",
      examples: "Real-world examples include: Gospel music notation examples from gospel services, Notation skills from gospel teams, Gospel music theory from gospel bands, Notation applications from gospel venues, Gospel music notation from gospel services, Contemporary gospel notation from gospel leaders, Notation management from gospel studios, Gospel music education from gospel schools, Gospel notation applications from gospel choirs, Contemporary gospel examples from gospel musicians, Professional gospel notation from gospel professionals, Gospel music examples from gospel artists, Contemporary gospel examples from gospel singers, Professional gospel notation examples from gospel engineers."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Technology Trends",
      description: "Master the art of worship technology with our comprehensive trends guide. Learn essential technology skills, worship production techniques, and how to apply technology to worship music. Perfect for worship leaders, sound engineers, and church technical teams.",
      type: "Video Series",
      size: "Online",
      downloads: "234",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video series covers all aspects of worship technology trends. Learn essential technology skills, worship production techniques, and how to apply technology to worship music.",
      content: "Comprehensive coverage includes: Worship technology fundamentals, Technology skills, Worship production techniques, Technology applications, Gospel technology, Contemporary worship technology, Technology management, Worship technology education, Gospel technology applications, Contemporary worship practice, Professional worship technology, Gospel technology examples, Contemporary worship examples, Professional worship technology examples.",
      exercises: "Technology exercises include: Worship technology drills, Technology skills practice, Worship production techniques practice, Technology applications, Gospel technology, Contemporary worship technology, Technology management, Worship technology education, Gospel technology applications, Contemporary worship practice, Professional worship technology, Gospel technology examples, Contemporary worship examples, Professional worship technology examples.",
      examples: "Real-world examples include: Worship technology examples from worship services, Technology skills from worship teams, Worship production techniques from worship bands, Technology applications from worship venues, Gospel technology from gospel services, Contemporary worship technology from worship leaders, Technology management from worship studios, Worship technology education from worship schools, Gospel technology applications from gospel choirs, Contemporary worship examples from worship musicians, Professional worship technology from worship professionals, Gospel technology examples from gospel artists, Contemporary worship examples from worship singers, Professional worship technology examples from worship engineers."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Acoustic Guitar Maintenance",
      description: "Master the art of acoustic guitar maintenance with our comprehensive guide. Learn essential maintenance skills, guitar care techniques, and how to keep your acoustic guitar in top condition. Perfect for worship guitarists, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "1.4 MB",
      downloads: "345",
      category: "Maintenance",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of acoustic guitar maintenance. Learn essential maintenance skills, guitar care techniques, and how to keep your acoustic guitar in top condition.",
      content: "Comprehensive coverage includes: Acoustic guitar maintenance fundamentals, Guitar care techniques, Maintenance applications, Gospel guitar maintenance, Contemporary worship guitar care, Maintenance management, Guitar care education, Gospel guitar applications, Contemporary worship practice, Professional guitar maintenance, Gospel guitar examples, Contemporary worship examples, Professional guitar maintenance examples.",
      exercises: "Maintenance exercises include: Acoustic guitar maintenance drills, Guitar care techniques practice, Maintenance applications, Gospel guitar maintenance, Contemporary worship guitar care, Maintenance management, Guitar care education, Gospel guitar applications, Contemporary worship practice, Professional guitar maintenance, Gospel guitar examples, Contemporary worship examples, Professional guitar maintenance examples.",
      examples: "Real-world examples include: Acoustic guitar maintenance examples from worship services, Guitar care techniques from worship teams, Maintenance applications from worship venues, Gospel guitar maintenance from gospel services, Contemporary worship guitar care from worship leaders, Maintenance management from worship studios, Guitar care education from worship schools, Gospel guitar applications from gospel choirs, Contemporary worship examples from worship musicians, Professional guitar maintenance from worship professionals, Gospel guitar examples from gospel artists, Contemporary worship examples from worship guitarists, Professional guitar maintenance examples from worship engineers."
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Digital Piano Setup Guide",
      description: "Master the art of setting up and configuring digital pianos for worship. Learn essential setup skills, digital piano techniques, and how to achieve professional sound quality. Perfect for worship keyboardists, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "567",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of setting up and configuring digital pianos for worship. Learn essential setup skills, digital piano techniques, and how to achieve professional sound quality.",
      content: "Comprehensive coverage includes: Digital piano setup fundamentals, Setup skills, Digital piano techniques, Setup applications, Gospel digital piano, Contemporary worship digital piano, Setup management, Digital piano education, Gospel digital piano applications, Contemporary worship practice, Professional digital piano setup, Gospel digital piano examples, Contemporary worship examples, Professional digital piano setup examples.",
      exercises: "Setup exercises include: Digital piano setup drills, Setup skills practice, Digital piano techniques practice, Setup applications, Gospel digital piano, Contemporary worship digital piano, Setup management, Digital piano education, Gospel digital piano applications, Contemporary worship practice, Professional digital piano setup, Gospel digital piano examples, Contemporary worship examples, Professional digital piano setup examples.",
      examples: "Real-world examples include: Digital piano setup examples from worship services, Setup skills from worship teams, Digital piano techniques from worship bands, Setup applications from worship venues, Gospel digital piano from gospel services, Contemporary worship digital piano from worship leaders, Setup management from worship studios, Digital piano education from worship schools, Gospel digital piano applications from gospel choirs, Contemporary worship examples from worship musicians, Professional digital piano setup from worship professionals, Gospel digital piano examples from gospel artists, Contemporary worship examples from worship keyboardists, Professional digital piano setup examples from worship engineers."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Vocal Health for Worship Singers",
      description: "Master the art of vocal health with our comprehensive guide for worship singers. Learn essential vocal health techniques, worship singing skills, and how to maintain vocal health in worship settings. Perfect for worship singers, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "1.6 MB",
      downloads: "789",
      category: "Health",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of vocal health for worship singers. Learn essential vocal health techniques, worship singing skills, and how to maintain vocal health in worship settings.",
      content: "Comprehensive coverage includes: Vocal health fundamentals, Worship singing techniques, Vocal health applications, Gospel vocal health, Contemporary worship vocal health, Vocal health management, Worship vocal education, Gospel vocal applications, Contemporary worship practice, Professional vocal health, Gospel vocal examples, Contemporary worship examples, Professional vocal health examples.",
      exercises: "Vocal health exercises include: Vocal health drills, Worship singing techniques practice, Vocal health applications, Gospel vocal health, Contemporary worship vocal health, Vocal health management, Worship vocal education, Gospel vocal applications, Contemporary worship practice, Professional vocal health, Gospel vocal examples, Contemporary worship examples, Professional vocal health examples.",
      examples: "Real-world examples include: Vocal health examples from worship services, Worship singing techniques from worship teams, Vocal health applications from worship venues, Gospel vocal health from gospel services, Contemporary worship vocal health from worship leaders, Vocal health management from worship studios, Worship vocal education from worship schools, Gospel vocal applications from gospel choirs, Contemporary worship examples from worship musicians, Professional vocal health from worship professionals, Gospel vocal examples from gospel artists, Contemporary worship examples from worship singers, Professional vocal health examples from worship engineers."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Conflict Resolution",
      description: "Master the art of resolving conflicts and maintaining harmony in worship teams. Learn essential conflict resolution skills, worship team management, and how to create harmonious worship teams. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "1.8 MB",
      downloads: "234",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of resolving conflicts and maintaining harmony in worship teams. Learn essential conflict resolution skills, worship team management, and how to create harmonious worship teams.",
      content: "Comprehensive coverage includes: Conflict resolution fundamentals, Worship team management, Conflict resolution applications, Gospel team conflict resolution, Contemporary worship team harmony, Conflict resolution management, Worship team education, Gospel team applications, Contemporary worship practice, Professional conflict resolution, Gospel team examples, Contemporary worship examples, Professional conflict resolution examples.",
      exercises: "Conflict resolution exercises include: Conflict resolution drills, Worship team management practice, Conflict resolution applications, Gospel team conflict resolution, Contemporary worship team harmony, Conflict resolution management, Worship team education, Gospel team applications, Contemporary worship practice, Professional conflict resolution, Gospel team examples, Contemporary worship examples, Professional conflict resolution examples.",
      examples: "Real-world examples include: Conflict resolution examples from worship services, Worship team management from worship teams, Conflict resolution applications from worship venues, Gospel team conflict resolution from gospel services, Contemporary worship team harmony from worship leaders, Conflict resolution management from worship studios, Worship team education from worship schools, Gospel team applications from gospel choirs, Contemporary worship examples from worship musicians, Professional conflict resolution from worship professionals, Gospel team examples from gospel artists, Contemporary worship examples from worship singers, Professional conflict resolution examples from worship engineers."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audio Interface Selection Guide",
      description: "Master the art of choosing the right audio interface for your worship setup. Learn essential selection skills, audio interface techniques, and how to achieve professional sound quality. Perfect for sound engineers, worship leaders, and church technical teams.",
      type: "PDF Guide",
      size: "1.3 MB",
      downloads: "456",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of choosing the right audio interface for worship setups. Learn essential selection skills, audio interface techniques, and how to achieve professional sound quality.",
      content: "Comprehensive coverage includes: Audio interface selection fundamentals, Selection skills, Audio interface techniques, Selection applications, Gospel audio interface, Contemporary worship audio interface, Selection management, Audio interface education, Gospel audio interface applications, Contemporary worship practice, Professional audio interface selection, Gospel audio interface examples, Contemporary worship examples, Professional audio interface selection examples.",
      exercises: "Selection exercises include: Audio interface selection drills, Selection skills practice, Audio interface techniques practice, Selection applications, Gospel audio interface, Contemporary worship audio interface, Selection management, Audio interface education, Gospel audio interface applications, Contemporary worship practice, Professional audio interface selection, Gospel audio interface examples, Contemporary worship examples, Professional audio interface selection examples.",
      examples: "Real-world examples include: Audio interface selection examples from worship services, Selection skills from worship teams, Audio interface techniques from worship bands, Selection applications from worship venues, Gospel audio interface from gospel services, Contemporary worship audio interface from worship leaders, Selection management from worship studios, Audio interface education from worship schools, Gospel audio interface applications from gospel choirs, Contemporary worship examples from worship musicians, Professional audio interface selection from worship professionals, Gospel audio interface examples from gospel artists, Contemporary worship examples from worship singers, Professional audio interface selection examples from worship engineers."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Worship Budget Planning",
      description: "Master the art of planning worship ministry budgets with our comprehensive guide. Learn essential budget planning skills, worship ministry management, and how to create effective worship budgets. Perfect for worship leaders, church administrators, and church leaders.",
      type: "Document",
      size: "0.9 MB",
      downloads: "345",
      category: "Finance",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of planning worship ministry budgets. Learn essential budget planning skills, worship ministry management, and how to create effective worship budgets.",
      content: "Comprehensive coverage includes: Worship budget planning fundamentals, Budget planning skills, Worship ministry management, Budget planning applications, Gospel budget planning, Contemporary worship budget planning, Budget planning management, Worship ministry education, Gospel budget applications, Contemporary worship practice, Professional budget planning, Gospel budget examples, Contemporary worship examples, Professional budget planning examples.",
      exercises: "Budget planning exercises include: Worship budget planning drills, Budget planning skills practice, Worship ministry management practice, Budget planning applications, Gospel budget planning, Contemporary worship budget planning, Budget planning management, Worship ministry education, Gospel budget applications, Contemporary worship practice, Professional budget planning, Gospel budget examples, Contemporary worship examples, Professional budget planning examples.",
      examples: "Real-world examples include: Worship budget planning examples from worship services, Budget planning skills from worship teams, Worship ministry management from worship bands, Budget planning applications from worship venues, Gospel budget planning from gospel services, Contemporary worship budget planning from worship leaders, Budget planning management from worship studios, Worship ministry education from worship schools, Gospel budget applications from gospel choirs, Contemporary worship examples from worship musicians, Professional budget planning from worship professionals, Gospel budget examples from gospel artists, Contemporary worship examples from worship singers, Professional budget planning examples from worship engineers."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Worship Ministry Assessment",
      description: "Master the art of assessing and improving your worship ministry effectiveness with our comprehensive guide. Learn essential assessment skills, worship ministry management, and how to create effective worship ministries. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "2.4 MB",
      downloads: "567",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of assessing and improving worship ministry effectiveness. Learn essential assessment skills, worship ministry management, and how to create effective worship ministries.",
      content: "Comprehensive coverage includes: Worship ministry assessment fundamentals, Assessment skills, Worship ministry management, Assessment applications, Gospel ministry assessment, Contemporary worship ministry assessment, Assessment management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry assessment, Gospel ministry examples, Contemporary worship examples, Professional ministry assessment examples.",
      exercises: "Assessment exercises include: Worship ministry assessment drills, Assessment skills practice, Worship ministry management practice, Assessment applications, Gospel ministry assessment, Contemporary worship ministry assessment, Assessment management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry assessment, Gospel ministry examples, Contemporary worship examples, Professional ministry assessment examples.",
      examples: "Real-world examples include: Worship ministry assessment examples from worship services, Assessment skills from worship teams, Worship ministry management from worship bands, Assessment applications from worship venues, Gospel ministry assessment from gospel services, Contemporary worship ministry assessment from worship leaders, Assessment management from worship studios, Worship ministry education from worship schools, Gospel ministry applications from gospel choirs, Contemporary worship examples from worship musicians, Professional ministry assessment from worship professionals, Gospel ministry examples from gospel artists, Contemporary worship examples from worship singers, Professional ministry assessment examples from worship engineers."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Management for Worship Leaders",
      description: "Master the art of time management with our comprehensive guide for worship leaders. Learn essential time management skills, worship leadership techniques, and how to manage time effectively in worship ministry. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "1.5 MB",
      downloads: "678",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of time management for worship leaders. Learn essential time management skills, worship leadership techniques, and how to manage time effectively in worship ministry.",
      content: "Comprehensive coverage includes: Time management fundamentals, Worship leadership techniques, Time management applications, Gospel time management, Contemporary worship time management, Time management management, Worship leadership education, Gospel leadership applications, Contemporary worship practice, Professional time management, Gospel leadership examples, Contemporary worship examples, Professional time management examples.",
      exercises: "Time management exercises include: Time management drills, Worship leadership techniques practice, Time management applications, Gospel time management, Contemporary worship time management, Time management management, Worship leadership education, Gospel leadership applications, Contemporary worship practice, Professional time management, Gospel leadership examples, Contemporary worship examples, Professional time management examples.",
      examples: "Real-world examples include: Time management examples from worship services, Worship leadership techniques from worship teams, Time management applications from worship venues, Gospel time management from gospel services, Contemporary worship time management from worship leaders, Time management management from worship studios, Worship leadership education from worship schools, Gospel leadership applications from gospel choirs, Contemporary worship examples from worship musicians, Professional time management from worship professionals, Gospel leadership examples from gospel artists, Contemporary worship examples from worship singers, Professional time management examples from worship engineers."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Performance Techniques",
      description: "Master the art of gospel music performance with our comprehensive techniques guide. Learn essential performance skills, gospel music techniques, and how to create engaging gospel performances. Perfect for gospel musicians, church musicians, and worship leaders.",
      type: "Video Course",
      size: "Online",
      downloads: "1,234",
      category: "Performance",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video course covers all aspects of gospel music performance techniques. Learn essential performance skills, gospel music techniques, and how to create engaging gospel performances.",
      content: "Comprehensive coverage includes: Gospel music performance fundamentals, Performance skills, Gospel music techniques, Performance applications, Gospel performance, Contemporary gospel performance, Performance management, Gospel music education, Gospel performance applications, Contemporary gospel practice, Professional gospel performance, Gospel performance examples, Contemporary gospel examples, Professional gospel performance examples.",
      exercises: "Performance exercises include: Gospel music performance drills, Performance skills practice, Gospel music techniques practice, Performance applications, Gospel performance, Contemporary gospel performance, Performance management, Gospel music education, Gospel performance applications, Contemporary gospel practice, Professional gospel performance, Gospel performance examples, Contemporary gospel examples, Professional gospel performance examples.",
      examples: "Real-world examples include: Gospel music performance examples from gospel services, Performance skills from gospel teams, Gospel music techniques from gospel bands, Performance applications from gospel venues, Gospel performance from gospel services, Contemporary gospel performance from gospel leaders, Performance management from gospel studios, Gospel music education from gospel schools, Gospel performance applications from gospel choirs, Contemporary gospel examples from gospel musicians, Professional gospel performance from gospel professionals, Gospel performance examples from gospel artists, Contemporary gospel examples from gospel singers, Professional gospel performance examples from gospel engineers."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Video Production",
      description: "Master the art of producing high-quality worship videos and live streams with our comprehensive guide. Learn essential video production skills, worship video techniques, and how to create engaging worship videos. Perfect for worship leaders, video producers, and church technical teams.",
      type: "Video Course",
      size: "Online",
      downloads: "456",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video course covers all aspects of producing high-quality worship videos and live streams. Learn essential video production skills, worship video techniques, and how to create engaging worship videos.",
      content: "Comprehensive coverage includes: Worship video production fundamentals, Video production skills, Worship video techniques, Video production applications, Gospel video production, Contemporary worship video production, Video production management, Worship video education, Gospel video applications, Contemporary worship practice, Professional worship video production, Gospel video examples, Contemporary worship examples, Professional worship video production examples.",
      exercises: "Video production exercises include: Worship video production drills, Video production skills practice, Worship video techniques practice, Video production applications, Gospel video production, Contemporary worship video production, Video production management, Worship video education, Gospel video applications, Contemporary worship practice, Professional worship video production, Gospel video examples, Contemporary worship examples, Professional worship video production examples.",
      examples: "Real-world examples include: Worship video production examples from worship services, Video production skills from worship teams, Worship video techniques from worship bands, Video production applications from worship venues, Gospel video production from gospel services, Contemporary worship video production from worship leaders, Video production management from worship studios, Worship video education from worship schools, Gospel video applications from gospel choirs, Contemporary worship examples from worship musicians, Professional worship video production from worship professionals, Gospel video examples from gospel artists, Contemporary worship examples from worship singers, Professional worship video production examples from worship engineers."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Effects for Worship",
      description: "Master the art of using guitar effects in worship settings with our comprehensive guide. Learn essential guitar effects techniques, worship guitar skills, and how to create engaging worship sounds. Perfect for worship guitarists, church musicians, and worship leaders.",
      type: "PDF Guide",
      size: "2.2 MB",
      downloads: "789",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of using guitar effects in worship settings. Learn essential guitar effects techniques, worship guitar skills, and how to create engaging worship sounds.",
      content: "Comprehensive coverage includes: Guitar effects fundamentals, Worship guitar techniques, Guitar effects applications, Gospel guitar effects, Contemporary worship guitar effects, Guitar effects management, Worship guitar education, Gospel guitar applications, Contemporary worship practice, Professional guitar effects, Gospel guitar examples, Contemporary worship examples, Professional guitar effects examples.",
      exercises: "Guitar effects exercises include: Guitar effects drills, Worship guitar techniques practice, Guitar effects applications, Gospel guitar effects, Contemporary worship guitar effects, Guitar effects management, Worship guitar education, Gospel guitar applications, Contemporary worship practice, Professional guitar effects, Gospel guitar examples, Contemporary worship examples, Professional guitar effects examples.",
      examples: "Real-world examples include: Guitar effects examples from worship services, Worship guitar techniques from worship teams, Guitar effects applications from worship venues, Gospel guitar effects from gospel services, Contemporary worship guitar effects from worship leaders, Guitar effects management from worship studios, Worship guitar education from worship schools, Gospel guitar applications from gospel choirs, Contemporary worship examples from worship musicians, Professional guitar effects from worship professionals, Gospel guitar examples from gospel artists, Contemporary worship examples from worship guitarists, Professional guitar effects examples from worship engineers."
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Pedal Techniques",
      description: "Master the art of using piano pedals for expressive worship playing with our comprehensive guide. Learn essential pedal techniques, worship piano skills, and how to create engaging worship sounds. Perfect for worship keyboardists, church musicians, and worship leaders.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "345",
      category: "Practice",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video tutorial covers all aspects of using piano pedals for expressive worship playing. Learn essential pedal techniques, worship piano skills, and how to create engaging worship sounds.",
      content: "Comprehensive coverage includes: Piano pedal fundamentals, Worship piano techniques, Pedal applications, Gospel piano pedals, Contemporary worship piano pedals, Pedal management, Worship piano education, Gospel piano applications, Contemporary worship practice, Professional piano pedals, Gospel piano examples, Contemporary worship examples, Professional piano pedal examples.",
      exercises: "Piano pedal exercises include: Piano pedal drills, Worship piano techniques practice, Pedal applications, Gospel piano pedals, Contemporary worship piano pedals, Pedal management, Worship piano education, Gospel piano applications, Contemporary worship practice, Professional piano pedals, Gospel piano examples, Contemporary worship examples, Professional piano pedal examples.",
      examples: "Real-world examples include: Piano pedal examples from worship services, Worship piano techniques from worship teams, Pedal applications from worship venues, Gospel piano pedals from gospel services, Contemporary worship piano pedals from worship leaders, Pedal management from worship studios, Worship piano education from worship schools, Gospel piano applications from gospel choirs, Contemporary worship examples from worship musicians, Professional piano pedals from worship professionals, Gospel piano examples from gospel artists, Contemporary worship examples from worship keyboardists, Professional piano pedal examples from worship engineers."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Worship Vocal Styling",
      description: "Master the art of vocal styling for worship music with our comprehensive guide. Learn essential vocal styling techniques, worship singing skills, and how to create engaging worship performances. Perfect for worship singers, church musicians, and worship leaders.",
      type: "Video Course",
      size: "Online",
      downloads: "1,456",
      category: "Performance",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video course covers all aspects of vocal styling for worship music. Learn essential vocal styling techniques, worship singing skills, and how to create engaging worship performances.",
      content: "Comprehensive coverage includes: Worship vocal styling fundamentals, Vocal styling techniques, Worship singing skills, Vocal styling applications, Gospel vocal styling, Contemporary worship vocal styling, Vocal styling management, Worship vocal education, Gospel vocal applications, Contemporary worship practice, Professional vocal styling, Gospel vocal examples, Contemporary worship examples, Professional vocal styling examples.",
      exercises: "Vocal styling exercises include: Worship vocal styling drills, Vocal styling techniques practice, Worship singing skills practice, Vocal styling applications, Gospel vocal styling, Contemporary worship vocal styling, Vocal styling management, Worship vocal education, Gospel vocal applications, Contemporary worship practice, Professional vocal styling, Gospel vocal examples, Contemporary worship examples, Professional vocal styling examples.",
      examples: "Real-world examples include: Worship vocal styling examples from worship services, Vocal styling techniques from worship teams, Worship singing skills from worship bands, Vocal styling applications from worship venues, Gospel vocal styling from gospel services, Contemporary worship vocal styling from worship leaders, Vocal styling management from worship studios, Worship vocal education from worship schools, Gospel vocal applications from gospel choirs, Contemporary worship examples from worship musicians, Professional vocal styling from worship professionals, Gospel vocal examples from gospel artists, Contemporary worship examples from worship singers, Professional vocal styling examples from worship engineers."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Mentoring",
      description: "Master the art of mentoring and developing new worship team members with our comprehensive guide. Learn essential mentoring skills, worship team development, and how to create effective worship teams. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "2.7 MB",
      downloads: "234",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of mentoring and developing new worship team members. Learn essential mentoring skills, worship team development, and how to create effective worship teams.",
      content: "Comprehensive coverage includes: Worship team mentoring fundamentals, Mentoring skills, Worship team development, Mentoring applications, Gospel team mentoring, Contemporary worship team mentoring, Mentoring management, Worship team education, Gospel team applications, Contemporary worship practice, Professional team mentoring, Gospel team examples, Contemporary worship examples, Professional team mentoring examples.",
      exercises: "Mentoring exercises include: Worship team mentoring drills, Mentoring skills practice, Worship team development practice, Mentoring applications, Gospel team mentoring, Contemporary worship team mentoring, Mentoring management, Worship team education, Gospel team applications, Contemporary worship practice, Professional team mentoring, Gospel team examples, Contemporary worship examples, Professional team mentoring examples.",
      examples: "Real-world examples include: Worship team mentoring examples from worship services, Mentoring skills from worship teams, Worship team development from worship bands, Mentoring applications from worship venues, Gospel team mentoring from gospel services, Contemporary worship team mentoring from worship leaders, Mentoring management from worship studios, Worship team education from worship schools, Gospel team applications from gospel choirs, Contemporary worship examples from worship musicians, Professional team mentoring from worship professionals, Gospel team examples from gospel artists, Contemporary worship examples from worship singers, Professional team mentoring examples from worship engineers."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Wireless Audio Systems",
      description: "Master the art of wireless audio systems for worship with our comprehensive guide. Learn essential wireless audio skills, worship sound management, and how to achieve professional sound quality. Perfect for sound engineers, worship leaders, and church technical teams.",
      type: "PDF Guide",
      size: "3.1 MB",
      downloads: "567",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of wireless audio systems for worship. Learn essential wireless audio skills, worship sound management, and how to achieve professional sound quality.",
      content: "Comprehensive coverage includes: Wireless audio fundamentals, Worship sound management, Wireless audio applications, Gospel wireless audio, Contemporary worship wireless audio, Wireless audio management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional wireless audio, Gospel sound examples, Contemporary worship examples, Professional wireless audio examples.",
      exercises: "Wireless audio exercises include: Wireless audio drills, Worship sound management practice, Wireless audio applications, Gospel wireless audio, Contemporary worship wireless audio, Wireless audio management, Worship sound education, Gospel sound applications, Contemporary worship practice, Professional wireless audio, Gospel sound examples, Contemporary worship examples, Professional wireless audio examples.",
      examples: "Real-world examples include: Wireless audio examples from worship services, Worship sound management from worship teams, Wireless audio applications from worship venues, Gospel wireless audio from gospel services, Contemporary worship wireless audio from worship leaders, Wireless audio management from worship studios, Worship sound education from worship schools, Gospel sound applications from gospel choirs, Contemporary worship examples from worship musicians, Professional wireless audio from worship professionals, Gospel sound examples from gospel artists, Contemporary worship examples from worship singers, Professional wireless audio examples from worship engineers."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Worship Ministry Policies",
      description: "Master the art of creating worship ministry policies with our comprehensive guide. Learn essential policy development skills, worship ministry management, and how to create effective worship policies. Perfect for worship leaders, church administrators, and church leaders.",
      type: "Document",
      size: "1.8 MB",
      downloads: "345",
      category: "Administration",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of creating worship ministry policies. Learn essential policy development skills, worship ministry management, and how to create effective worship policies.",
      content: "Comprehensive coverage includes: Worship ministry policy fundamentals, Policy development skills, Worship ministry management, Policy applications, Gospel ministry policies, Contemporary worship ministry policies, Policy management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry policies, Gospel ministry examples, Contemporary worship examples, Professional ministry policy examples.",
      exercises: "Policy development exercises include: Worship ministry policy drills, Policy development skills practice, Worship ministry management practice, Policy applications, Gospel ministry policies, Contemporary worship ministry policies, Policy management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry policies, Gospel ministry examples, Contemporary worship examples, Professional ministry policy examples.",
      examples: "Real-world examples include: Worship ministry policy examples from worship services, Policy development skills from worship teams, Worship ministry management from worship bands, Policy applications from worship venues, Gospel ministry policies from gospel services, Contemporary worship ministry policies from worship leaders, Policy management from worship studios, Worship ministry education from worship schools, Gospel ministry applications from gospel choirs, Contemporary worship examples from worship musicians, Professional ministry policies from worship professionals, Gospel ministry examples from gospel artists, Contemporary worship examples from worship singers, Professional ministry policy examples from worship engineers."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Worship Ministry Excellence",
      description: "Master the art of achieving excellence in worship ministry with our comprehensive guide. Learn essential excellence principles, worship ministry management, and how to create effective worship ministries. Perfect for worship leaders, music directors, and church leaders.",
      type: "PDF Guide",
      size: "2.5 MB",
      downloads: "678",
      category: "Leadership",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of achieving excellence in worship ministry. Learn essential excellence principles, worship ministry management, and how to create effective worship ministries.",
      content: "Comprehensive coverage includes: Worship ministry excellence fundamentals, Excellence principles, Worship ministry management, Excellence applications, Gospel ministry excellence, Contemporary worship ministry excellence, Excellence management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry excellence, Gospel ministry examples, Contemporary worship examples, Professional ministry excellence examples.",
      exercises: "Excellence exercises include: Worship ministry excellence drills, Excellence principles practice, Worship ministry management practice, Excellence applications, Gospel ministry excellence, Contemporary worship ministry excellence, Excellence management, Worship ministry education, Gospel ministry applications, Contemporary worship practice, Professional ministry excellence, Gospel ministry examples, Contemporary worship examples, Professional ministry excellence examples.",
      examples: "Real-world examples include: Worship ministry excellence examples from worship services, Excellence principles from worship teams, Worship ministry management from worship bands, Excellence applications from worship venues, Gospel ministry excellence from gospel services, Contemporary worship ministry excellence from worship leaders, Excellence management from worship studios, Worship ministry education from worship schools, Gospel ministry applications from gospel choirs, Contemporary worship examples from worship musicians, Professional ministry excellence from worship professionals, Gospel ministry examples from gospel artists, Contemporary worship examples from worship singers, Professional ministry excellence examples from worship engineers."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Worship Service Flow Templates",
      description: "Master the art of planning worship service flow and transitions with our comprehensive templates. Learn essential flow planning skills, worship service management, and how to create effective worship services. Perfect for worship leaders, music directors, and church leaders.",
      type: "Document",
      size: "0.7 MB",
      downloads: "456",
      category: "Templates",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive template covers all aspects of planning worship service flow and transitions. Learn essential flow planning skills, worship service management, and how to create effective worship services.",
      content: "Comprehensive coverage includes: Worship service flow fundamentals, Flow planning skills, Worship service management, Flow applications, Gospel service flow, Contemporary worship service flow, Flow management, Worship service education, Gospel service applications, Contemporary worship practice, Professional service flow, Gospel service examples, Contemporary worship examples, Professional service flow examples.",
      exercises: "Flow planning exercises include: Worship service flow drills, Flow planning skills practice, Worship service management practice, Flow applications, Gospel service flow, Contemporary worship service flow, Flow management, Worship service education, Gospel service applications, Contemporary worship practice, Professional service flow, Gospel service examples, Contemporary worship examples, Professional service flow examples.",
      examples: "Real-world examples include: Worship service flow examples from worship services, Flow planning skills from worship teams, Worship service management from worship bands, Flow applications from worship venues, Gospel service flow from gospel services, Contemporary worship service flow from worship leaders, Flow management from worship studios, Worship service education from worship schools, Gospel service applications from gospel choirs, Contemporary worship examples from worship musicians, Professional service flow from worship professionals, Gospel service examples from gospel artists, Contemporary worship examples from worship singers, Professional service flow examples from worship engineers."
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Arranging Masterclass",
      description: "Master the art of arranging gospel music for different ensembles with our comprehensive masterclass. Learn essential arranging techniques, gospel music skills, and how to create engaging gospel arrangements. Perfect for gospel musicians, church musicians, and worship leaders.",
      type: "Video Course",
      size: "Online",
      downloads: "1,123",
      category: "Training",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive video masterclass covers all aspects of arranging gospel music for different ensembles. Learn essential arranging techniques, gospel music skills, and how to create engaging gospel arrangements.",
      content: "Comprehensive coverage includes: Gospel music arranging fundamentals, Arranging techniques, Gospel music skills, Arranging applications, Gospel arranging, Contemporary gospel arranging, Arranging management, Gospel music education, Gospel arranging applications, Contemporary gospel practice, Professional gospel arranging, Gospel arranging examples, Contemporary gospel examples, Professional gospel arranging examples.",
      exercises: "Arranging exercises include: Gospel music arranging drills, Arranging techniques practice, Gospel music skills practice, Arranging applications, Gospel arranging, Contemporary gospel arranging, Arranging management, Gospel music education, Gospel arranging applications, Contemporary gospel practice, Professional gospel arranging, Gospel arranging examples, Contemporary gospel examples, Professional gospel arranging examples.",
      examples: "Real-world examples include: Gospel music arranging examples from gospel services, Arranging techniques from gospel teams, Gospel music skills from gospel bands, Arranging applications from gospel venues, Gospel arranging from gospel services, Contemporary gospel arranging from gospel leaders, Arranging management from gospel studios, Gospel music education from gospel schools, Gospel arranging applications from gospel choirs, Contemporary gospel examples from gospel musicians, Professional gospel arranging from gospel professionals, Gospel arranging examples from gospel artists, Contemporary gospel examples from gospel singers, Professional gospel arranging examples from gospel engineers."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Lighting Design",
      description: "Master the art of worship lighting design with our comprehensive guide. Learn essential lighting techniques, worship atmosphere creation, and how to create engaging worship environments. Perfect for worship leaders, lighting designers, and church technical teams.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "234",
      category: "Technical",
      author: "Heavenkeys Music Academy",
      overview: "This comprehensive guide covers all aspects of worship lighting design, from basic principles to advanced techniques. Learn how to create powerful atmospheres that enhance worship experiences through strategic lighting placement, color theory, and dynamic effects. Perfect for churches of all sizes looking to transform their worship spaces.",
      content: "Comprehensive coverage includes: The three disciplines of worship lighting (theatrical, performance, and studio lighting), Basic lighting techniques including front lighting, side lighting, back lighting, down lighting, and background lighting, Lighting key areas of the sanctuary including floor areas, preaching positions, performance areas, band/orchestra zones, choir areas, and set design, Creating lighting 'looks' through color selection, music analysis, and scene building, Lighting control systems including consoles, architectural controls, and power management, Types of luminaires including Fresnels, Profiles, PARs, moving heads, and studio fixtures, Color theory for worship including warm colors for intimacy and cool colors for contemplation, Layered lighting for depth and focus, Accent lighting for altars and architectural features, LED uplighting for modern worship stages, Dynamic lighting for praise and worship sessions, Natural light integration for day services, Energy efficiency and maintenance considerations, and Professional lighting design principles for worship environments.",
      exercises: "Lighting design exercises include: Front lighting setup at 45-degree angles for optimal visibility, Back lighting techniques for creating separation and depth, Color temperature exercises using warm and cool colors, Layered lighting practice with ambient, accent, and task lighting, Dynamic lighting programming for different worship moments, Scene building exercises for walk-in, welcome, worship, and sermon lighting, Color mixing exercises using complementary colors, Gobo and pattern exercises for texture and atmosphere, Haze integration exercises for beam effects, Lighting control programming exercises, Energy efficiency optimization exercises, and Maintenance scheduling and troubleshooting exercises.",
      examples: "Real-world examples include: Tidal Creek Fellowship Church lighting transformation with Pro Church Lights system, Vari-Lite and Strand lighting solutions for houses of worship, Contemporary church lighting with LED uplighting and color changing fixtures, Church cross lighting creating focal points and spiritual ambiance, Church chandelier lighting for elegant and reverent atmospheres, Stage lighting for pastors with front and back lighting techniques, Worship leader lighting with angled front lighting and color temperature changes, Dynamic lighting scenes for different worship moments, House lighting integration for congregation engagement, Wall panel controls for easy lighting management, Power sequencing for energy efficiency, and Professional lighting design case studies from various church environments."
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar String Selection Guide",
      description: "How to choose the right strings for different worship styles.",
      type: "PDF Guide",
      size: "1.2 MB",
      downloads: "345",
      category: "Maintenance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Tuning and Maintenance",
      description: "Essential piano maintenance and tuning techniques.",
      type: "PDF Guide",
      size: "2.8 MB",
      downloads: "456",
      category: "Maintenance"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Worship Microphone Selection",
      description: "Complete guide to choosing the right microphones for worship.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "567",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Communication",
      description: "Effective communication strategies for worship teams.",
      type: "PDF Guide",
      size: "1.9 MB",
      downloads: "678",
      category: "Leadership"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audio Mixing for Worship",
      description: "Professional audio mixing techniques for worship services.",
      type: "Video Course",
      size: "Online",
      downloads: "1,789",
      category: "Technical"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Worship Ministry Evaluation",
      description: "Tools for evaluating and improving worship ministry effectiveness.",
      type: "Document",
      size: "1.4 MB",
      downloads: "234",
      category: "Administration"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Worship Ministry Vision Casting",
      description: "How to cast and communicate vision for worship ministry.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "345",
      category: "Leadership"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Worship Rehearsal Schedules",
      description: "Templates for scheduling and managing worship rehearsals.",
      type: "Document",
      size: "0.6 MB",
      downloads: "456",
      category: "Templates"
    },
    // Additional 50 Resources
    {
      icon: <Music className="h-6 w-6" />,
      title: "Advanced Gospel Harmonies",
      description: "Learn complex harmony techniques used in contemporary gospel music.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "1,234",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Fingerpicking Patterns for Worship",
      description: "Master fingerpicking techniques for acoustic worship guitar.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "892",
      category: "Practice"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Jazz Gospel Piano Techniques",
      description: "Advanced jazz-influenced piano techniques for gospel music.",
      type: "PDF Guide",
      size: "3.4 MB",
      downloads: "567",
      category: "Training"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Team Communication Guide",
      description: "Best practices for effective communication within worship teams.",
      type: "Document",
      size: "1.2 MB",
      downloads: "789",
      category: "Leadership"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Sound Engineering for Worship",
      description: "Complete guide to sound engineering for worship services.",
      type: "Video Series",
      size: "Online",
      downloads: "1,456",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Building Exercises",
      description: "Team building activities specifically designed for worship teams.",
      type: "Document",
      size: "0.8 MB",
      downloads: "634",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music History Timeline",
      description: "Comprehensive timeline of gospel music development and key figures.",
      type: "PDF Guide",
      size: "2.8 MB",
      downloads: "923",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Capo Usage Guide",
      description: "Complete guide to using capos effectively in worship music.",
      type: "PDF Guide",
      size: "1.5 MB",
      downloads: "1,123",
      category: "Practice"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Pedal Techniques",
      description: "Master the use of sustain, soft, and sostenuto pedals in worship.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "445",
      category: "Training"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Song Arrangement Templates",
      description: "Templates for arranging worship songs for different ensemble sizes.",
      type: "Document",
      size: "1.7 MB",
      downloads: "1,789",
      category: "Templates"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Live Streaming Worship Setup",
      description: "Technical guide for setting up live streaming for worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "2,134",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Leader Mentorship Program",
      description: "Structured mentorship program for developing worship leaders.",
      type: "Document",
      size: "2.3 MB",
      downloads: "567",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Chord Substitution Guide",
      description: "Learn how to substitute chords to create richer harmonies.",
      type: "PDF Guide",
      size: "1.9 MB",
      downloads: "1,345",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Acoustic Guitar Maintenance",
      description: "Complete guide to maintaining and caring for acoustic guitars.",
      type: "PDF Guide",
      size: "1.4 MB",
      downloads: "678",
      category: "Maintenance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Digital Piano Setup Guide",
      description: "How to set up and configure digital pianos for worship.",
      type: "Document",
      size: "1.1 MB",
      downloads: "456",
      category: "Technical"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Copyright Guidelines",
      description: "Understanding copyright laws and licensing for worship music.",
      type: "Document",
      size: "0.9 MB",
      downloads: "1,234",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Vocal Warm-up Exercises",
      description: "Professional vocal warm-up routines for worship singers.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "2,567",
      category: "Training"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Conflict Resolution",
      description: "Strategies for resolving conflicts within worship teams.",
      type: "Document",
      size: "1.3 MB",
      downloads: "789",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Notation Guide",
      description: "Learn to read and write gospel music notation effectively.",
      type: "PDF Guide",
      size: "2.6 MB",
      downloads: "1,456",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Electric Guitar for Worship",
      description: "Techniques and setups for electric guitar in worship music.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,123",
      category: "Training"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Improvisation Techniques",
      description: "Learn to improvise piano parts during worship services.",
      type: "PDF Guide",
      size: "2.2 MB",
      downloads: "1,789",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Budget Planning",
      description: "Templates and guides for planning worship ministry budgets.",
      type: "Document",
      size: "1.6 MB",
      downloads: "634",
      category: "Administration"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Stage Lighting for Worship",
      description: "Complete guide to stage lighting design for worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,345",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Recruitment",
      description: "Strategies for finding and recruiting new worship team members.",
      type: "Document",
      size: "1.8 MB",
      downloads: "567",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Analysis",
      description: "How to analyze and understand gospel music structure and style.",
      type: "PDF Guide",
      size: "3.1 MB",
      downloads: "923",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Effects for Worship",
      description: "Guide to using effects pedals effectively in worship music.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,234",
      category: "Technical"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Transposition Guide",
      description: "Learn to transpose piano parts to different keys quickly.",
      type: "PDF Guide",
      size: "1.7 MB",
      downloads: "1,456",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Policies",
      description: "Sample policies and procedures for worship ministries.",
      type: "Document",
      size: "2.4 MB",
      downloads: "789",
      category: "Administration"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Audio Recording for Worship",
      description: "Professional audio recording techniques for worship music.",
      type: "Video Series",
      size: "Online",
      downloads: "1,678",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Training Schedule",
      description: "Structured training schedule for developing worship team skills.",
      type: "Document",
      size: "1.2 MB",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Performance Tips",
      description: "Professional tips for performing gospel music effectively.",
      type: "PDF Guide",
      size: "1.9 MB",
      downloads: "2,345",
      category: "Performance"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar String Changing Guide",
      description: "Step-by-step guide to changing guitar strings properly.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,456",
      category: "Maintenance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Tuning Basics",
      description: "Basic piano tuning techniques for worship pianos.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "567",
      category: "Maintenance"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Insurance Guide",
      description: "Understanding insurance needs for worship ministries.",
      type: "Document",
      size: "1.5 MB",
      downloads: "456",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Video Production",
      description: "Creating professional worship videos and live streams.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "2,789",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Evaluation Forms",
      description: "Forms for evaluating and improving worship team performance.",
      type: "Document",
      size: "0.7 MB",
      downloads: "1,234",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Copyright Resources",
      description: "Resources for understanding gospel music copyright and licensing.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "1,567",
      category: "Legal"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Setup and Intonation",
      description: "Professional guitar setup techniques for optimal playability.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,789",
      category: "Maintenance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Maintenance Schedule",
      description: "Regular maintenance schedule for keeping pianos in top condition.",
      type: "Document",
      size: "1.0 MB",
      downloads: "678",
      category: "Maintenance"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Tax Guide",
      description: "Tax considerations and deductions for worship ministries.",
      type: "Document",
      size: "1.8 MB",
      downloads: "345",
      category: "Finance"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Stage Design",
      description: "Creative stage design ideas for worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,456",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Communication Tools",
      description: "Digital tools and apps for worship team communication.",
      type: "Document",
      size: "1.3 MB",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Marketing Guide",
      description: "Marketing strategies for gospel music and worship ministries.",
      type: "PDF Guide",
      size: "2.7 MB",
      downloads: "789",
      category: "Administration"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Care and Storage",
      description: "Proper care and storage techniques for guitars.",
      type: "PDF Guide",
      size: "1.4 MB",
      downloads: "1,345",
      category: "Maintenance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Performance Anxiety",
      description: "Overcoming performance anxiety for piano players in worship.",
      type: "PDF Guide",
      size: "1.6 MB",
      downloads: "1,567",
      category: "Health"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Fundraising",
      description: "Creative fundraising ideas for worship ministries.",
      type: "Document",
      size: "1.9 MB",
      downloads: "567",
      category: "Finance"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Audio Mixing",
      description: "Professional audio mixing techniques for worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "2,234",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Retreat Planning",
      description: "Planning and organizing worship team retreats and events.",
      type: "Document",
      size: "1.7 MB",
      downloads: "890",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Education Resources",
      description: "Educational resources for learning gospel music history and theory.",
      type: "PDF Guide",
      size: "3.2 MB",
      downloads: "1,234",
      category: "Theory"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Practice Routines",
      description: "Structured practice routines for worship guitarists.",
      type: "Document",
      size: "1.5 MB",
      downloads: "1,678",
      category: "Practice"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Sight-Reading for Worship",
      description: "Develop sight-reading skills for worship piano playing.",
      type: "PDF Guide",
      size: "2.5 MB",
      downloads: "1,456",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Legal Issues",
      description: "Common legal issues and solutions for worship ministries.",
      type: "Document",
      size: "2.1 MB",
      downloads: "678",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Technology Integration",
      description: "Integrating modern technology into worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,789",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Motivation",
      description: "Keeping worship team members motivated and engaged.",
      type: "Document",
      size: "1.4 MB",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Arrangement Software",
      description: "Software recommendations for arranging gospel music.",
      type: "PDF Guide",
      size: "1.8 MB",
      downloads: "1,345",
      category: "Technical"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Health and Ergonomics",
      description: "Preventing injuries and maintaining good posture while playing.",
      type: "PDF Guide",
      size: "1.6 MB",
      downloads: "1,567",
      category: "Health"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Duet Arrangements",
      description: "Arranging worship songs for piano duets.",
      type: "PDF Guide",
      size: "2.2 MB",
      downloads: "1,234",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Budget Templates",
      description: "Excel templates for worship ministry budget planning.",
      type: "Document",
      size: "0.9 MB",
      downloads: "789",
      category: "Finance"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Visual Design",
      description: "Creating effective visual elements for worship services.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,456",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Certification",
      description: "Certification programs for worship team development.",
      type: "Document",
      size: "1.7 MB",
      downloads: "567",
      category: "Certification"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Performance Rights",
      description: "Understanding performance rights for gospel music.",
      type: "PDF Guide",
      size: "2.0 MB",
      downloads: "1,123",
      category: "Legal"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Amplifier Setup",
      description: "Professional amplifier setup for worship guitar.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,789",
      category: "Technical"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Accompaniment Styles",
      description: "Different accompaniment styles for worship piano.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "1,456",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Insurance",
      description: "Insurance coverage options for worship ministries.",
      type: "Document",
      size: "1.5 MB",
      downloads: "456",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Live Streaming Setup",
      description: "Complete setup guide for worship live streaming.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "2,567",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Leadership Development",
      description: "Developing leadership skills within worship teams.",
      type: "Document",
      size: "1.8 MB",
      downloads: "890",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Publishing Guide",
      description: "Guide to publishing and distributing gospel music.",
      type: "PDF Guide",
      size: "2.4 MB",
      downloads: "1,234",
      category: "Administration"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Performance Techniques",
      description: "Advanced performance techniques for worship guitar.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,345",
      category: "Performance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Worship Improvisation",
      description: "Improvising piano parts during worship services.",
      type: "PDF Guide",
      size: "2.1 MB",
      downloads: "1,678",
      category: "Practice"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Compliance",
      description: "Ensuring compliance with church and legal requirements.",
      type: "Document",
      size: "1.9 MB",
      downloads: "567",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Audio Troubleshooting",
      description: "Common audio problems and solutions in worship.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,456",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Conflict Management",
      description: "Managing and resolving conflicts in worship teams.",
      type: "Document",
      size: "1.6 MB",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Business Guide",
      description: "Business aspects of gospel music ministry.",
      type: "PDF Guide",
      size: "2.7 MB",
      downloads: "789",
      category: "Administration"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Worship Leading",
      description: "Leading worship from the guitar position.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,234",
      category: "Leadership"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Worship Leading",
      description: "Leading worship from the piano position.",
      type: "PDF Guide",
      size: "2.2 MB",
      downloads: "1,456",
      category: "Leadership"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Risk Management",
      description: "Identifying and managing risks in worship ministry.",
      type: "Document",
      size: "1.7 MB",
      downloads: "456",
      category: "Legal"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Technology Trends",
      description: "Latest technology trends in worship ministry.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,789",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Success Metrics",
      description: "Measuring and tracking worship team success.",
      type: "Document",
      size: "1.4 MB",
      downloads: "1,345",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Industry Guide",
      description: "Understanding the gospel music industry landscape.",
      type: "PDF Guide",
      size: "2.8 MB",
      downloads: "1,567",
      category: "Administration"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Worship Ministry",
      description: "Building a guitar-focused worship ministry.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Worship Ministry",
      description: "Building a piano-focused worship ministry.",
      type: "PDF Guide",
      size: "2.5 MB",
      downloads: "1,234",
      category: "Leadership"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Documentation",
      description: "Essential documentation for worship ministries.",
      type: "Document",
      size: "1.8 MB",
      downloads: "678",
      category: "Administration"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Audio Mastering",
      description: "Mastering audio for worship recordings.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,456",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Mentorship",
      description: "Establishing mentorship programs in worship teams.",
      type: "Document",
      size: "1.6 MB",
      downloads: "890",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Networking",
      description: "Building networks in the gospel music community.",
      type: "PDF Guide",
      size: "2.3 MB",
      downloads: "1,234",
      category: "Administration"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Worship Resources",
      description: "Comprehensive resources for guitar worship ministry.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,567",
      category: "Leadership"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Worship Resources",
      description: "Comprehensive resources for piano worship ministry.",
      type: "PDF Guide",
      size: "2.6 MB",
      downloads: "1,345",
      category: "Leadership"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Sustainability",
      description: "Building sustainable worship ministries.",
      type: "Document",
      size: "1.9 MB",
      downloads: "567",
      category: "Administration"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Audio Innovation",
      description: "Innovative audio techniques for worship.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,678",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Excellence",
      description: "Pursuing excellence in worship team ministry.",
      type: "Document",
      size: "1.7 MB",
      downloads: "1,123",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Innovation",
      description: "Innovation in gospel music composition and performance.",
      type: "PDF Guide",
      size: "2.9 MB",
      downloads: "1,456",
      category: "Performance"
    },
    {
      icon: <Guitar className="h-6 w-6" />,
      title: "Guitar Worship Innovation",
      description: "Innovative approaches to guitar worship.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,234",
      category: "Performance"
    },
    {
      icon: <Piano className="h-6 w-6" />,
      title: "Piano Worship Innovation",
      description: "Innovative approaches to piano worship.",
      type: "PDF Guide",
      size: "2.4 MB",
      downloads: "1,567",
      category: "Performance"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Worship Ministry Future",
      description: "Future trends and directions in worship ministry.",
      type: "Document",
      size: "2.1 MB",
      downloads: "789",
      category: "Administration"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Worship Technology Future",
      description: "Future technology trends in worship.",
      type: "Video Tutorial",
      size: "Online",
      downloads: "1,345",
      category: "Technical"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Worship Team Future",
      description: "Future of worship team ministry.",
      type: "Document",
      size: "1.8 MB",
      downloads: "1,234",
      category: "Leadership"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Gospel Music Future",
      description: "Future directions in gospel music.",
      type: "PDF Guide",
      size: "3.0 MB",
      downloads: "1,678",
      category: "Performance"
    }
  ];

  const categories = [
    { name: "All Resources", count: resources.length },
    { name: "Theory", count: resources.filter(r => r.category === "Theory").length },
    { name: "Scales", count: resources.filter(r => r.category === "Scales").length },
    { name: "Chords", count: resources.filter(r => r.category === "Chords").length },
    { name: "Training", count: resources.filter(r => r.category === "Training").length },
    { name: "Templates", count: resources.filter(r => r.category === "Templates").length },
    { name: "Practice", count: resources.filter(r => r.category === "Practice").length },
    { name: "Leadership", count: resources.filter(r => r.category === "Leadership").length },
    { name: "Technical", count: resources.filter(r => r.category === "Technical").length },
    { name: "Legal", count: resources.filter(r => r.category === "Legal").length },
    { name: "Certification", count: resources.filter(r => r.category === "Certification").length },
    { name: "Maintenance", count: resources.filter(r => r.category === "Maintenance").length },
    { name: "Health", count: resources.filter(r => r.category === "Health").length },
    { name: "Finance", count: resources.filter(r => r.category === "Finance").length },
    { name: "Performance", count: resources.filter(r => r.category === "Performance").length },
    { name: "Administration", count: resources.filter(r => r.category === "Administration").length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Theory":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Scales":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "Chords":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "Training":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Templates":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Practice":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Leadership":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "Technical":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Legal":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Certification":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Maintenance":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      case "Health":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "Finance":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Performance":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300";
      case "Administration":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All Resources" || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const visibleResources = filteredResources.slice(0, displayedResources);
  const hasMoreResources = displayedResources < filteredResources.length;

  const handleLoadMore = () => {
    setDisplayedResources(prev => Math.min(prev + 12, filteredResources.length));
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 xs:pt-20 sm:pt-24 min-h-screen">
        <section className="py-20 px-6 max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Explore Our Resources
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Download guides, templates, and tutorials to enhance your musical journey.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar for Categories */}
            <aside className="w-full md:w-1/4">
              <Card className="p-6">
                <CardTitle className="mb-4 text-2xl">Categories</CardTitle>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={activeCategory === category.name ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => {
                        setActiveCategory(category.name);
                        setDisplayedResources(12);
                      }}
                    >
                      {category.name}
                      <Badge variant="secondary">{category.count}</Badge>
                    </Button>
                  ))}
                </div>
              </Card>
            </aside>

            {/* Main Content for Resources */}
            <div className="w-full md:w-3/4">
              <div className="mb-8">
                <EnhancedSearch
                  placeholder="Search resources..."
                  onSearch={(query) => {
                    setSearchQuery(query);
                    setDisplayedResources(12);
                  }}
                  onResultSelect={(result) => {
                    // Handle resource selection
                    console.log("Selected resource:", result);
                  }}
                  showFilters={true}
                  showSort={true}
                />
              </div>

              {visibleResources.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No resources found matching your criteria.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {visibleResources.map((resource, index) => (
                      <Card key={index} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex-row items-center gap-4 pb-2">
                          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                            {resource.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold">{resource.title}</CardTitle>
                            <Badge className={`mt-1 ${getCategoryColor(resource.category)}`}>
                              {resource.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                          
                          {/* Rating Display */}
                          {resource.rating && (
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= Math.floor(resource.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{resource.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({resource.totalRatings} reviews)
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Type: {resource.type}</span>
                            <span>Size: {resource.size}</span>
                            <span>Downloads: {resource.downloads}</span>
                          </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end gap-3">
                          <Button variant="outline" className="rounded-full" asChild>
                            <Link href={`/resources/${resource.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                              <BookOpen className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                          <Button className="rounded-full">
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </div>
                        
                        {/* Resource Rating Component */}
                        <ResourceRating
                          resourceId={resource.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                          resourceTitle={resource.title}
                          resourceType={resource.type}
                        />
                      </Card>
                    ))}
                  </div>

                  {hasMoreResources && (
                    <div className="text-center mt-12">
                      <Button 
                        size="lg" 
                        className="rounded-full"
                        onClick={handleLoadMore}
                      >
                        Load More Resources ({filteredResources.length - displayedResources} remaining)
                        <ExternalLink className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 px-6 bg-secondary/20 dark:bg-secondary/10">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">
              Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <CardTitle className="mb-4">Beginner's Bundle</CardTitle>
                <CardContent className="text-muted-foreground">
                  Start your journey with essential guides and practice routines.
                </CardContent>
                <Button className="mt-4 rounded-full">View Collection</Button>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="mb-4">Worship Leader Pack</CardTitle>
                <CardContent className="text-muted-foreground">
                  Resources for effective worship leading and team management.
                </CardContent>
                <Button className="mt-4 rounded-full">View Collection</Button>
              </Card>
              <Card className="p-6 text-center">
                <CardTitle className="mb-4">Musician's Toolkit</CardTitle>
                <CardContent className="text-muted-foreground">
                  Advanced theory, technical guides, and performance tips.
                </CardContent>
                <Button className="mt-4 rounded-full">View Collection</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-20 px-6">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with other musicians, share insights, and get support.
            </p>
            <Button size="lg" className="rounded-full">
              Join the Forum
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ResourcesPage;