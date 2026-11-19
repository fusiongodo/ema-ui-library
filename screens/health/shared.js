/* Apple Health (idea). Every value is shown against the person's own usual (the middle half of the last four weeks), never
   against a goal; only a deviation gets a mark; not worn = no data, never zero. One model over all data: a pattern lists
   what was different in the check-ins and in the tracker data side by side. Today is the reception: at most one quiet line.
   Demo date Tue 3 Nov 2026, afternoon (as on today/home). Steps today so far 2,100; usual 1,100 to 1,700 a day.
   Shared by the Apple Health screens (screens/health/*):
   · HEALTH_TABTO: after connecting, the tabs lead to the states with Apple Health.
   · HEALTH_STEPS: 28 days of steps, 7 Oct … today 3 Nov (index 0 = 7 Oct). No data on 27 Oct (watch not worn).
     Above the usual: 9, 18, 24, 30 Oct (the days of the pattern in insights/pattern-exertion inside these four weeks)
     and today. */
const HEALTH_TABTO = {"Check-ins":"checkins/overview-health", Today:"today/home-health", Insights:"insights/home-health-on"};
const HEALTH_STEPS = [1500,1650,2550,950,1050,1450,1600,1650,1550,1550,1650,2400,1000,850,1350,1500,1700,2650,1100,950,null,1450,1600,2350,1050,1200,1550,2100];
