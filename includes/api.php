<!-- includes/api.php -->
<?php
// Exit if accessed directly
if (!defined('ABSPATH')) exit;

// Registrera REST API-endpoint
add_action('rest_api_init', function () {
    register_rest_route('kursfilter/v1', '/courses', [
        'methods'  => 'GET',
        'callback' => 'kursfilter_get_courses',
        'permission_callback' => '__return_true',
    ]);
});

// Huvudfunktion – returnerar berikade och filtrerade kurser
function kursfilter_get_courses() {
    $courses = kursfilter_get_sheet_data('courses');
    $organizers = kursfilter_get_sheet_data('organizers');

    if (!$courses || !$organizers) {
        return new WP_Error('no_data', 'Data kunde inte hämtas', ['status' => 500]);
    }

    $today = date('Y-m-d');
    $organizers_map = [];

    foreach ($organizers as $org) {
        if (!empty($org['org_id'])) {
            $organizers_map[$org['org_id']] = $org;
        }
    }

    // Filtrera och berika kurser
    $filtered = array_filter($courses, function ($course) use ($today) {
        return (
            strtolower(trim($course['approved'])) === 'true' &&
            strtolower(trim($course['export_status'])) !== 'hidden' &&
            (!empty($course['visible_until']) && $course['visible_until'] >= $today)
        );
    });

    // Berika varje kurs med arrangörsinfo
    $enriched = array_map(function ($course) use ($organizers_map) {
        $org_id = $course['org_id'] ?? null;
        $organizer = $organizers_map[$org_id] ?? [];

        return [
            'id' => $course['course_id'] ?? '',
            'name' => $course['course_name'] ?? '',
            'age_group' => $course['age_group'] ?? '',
            'city' => $course['city'] ?? '',
            'municipality' => $course['municipality'] ?? '',
            'region' => $course['region'] ?? '',
            'weekday' => $course['weekday'] ?? '',
            'time' => $course['time'] ?? '',
            'booking_url' => $course['booking_url'] ?? '',
            'description' => $course['description'] ?? '',
            'is_popular' => strtolower(trim($course['is_popular'] ?? '')) === 'true',
            'sort_id' => intval($course['sort_id'] ?? 999),
            'organizer' => [
                'name' => $organizer['org_name'] ?? '',
                'email' => $organizer['org_email'] ?? '',
                'phone' => $organizer['org_phone'] ?? '',
            ],
        ];
    }, $filtered);

    // Sortera efter sort_id, sedan namn
    usort($enriched, function ($a, $b) {
        $cmp = $a['sort_id'] <=> $b['sort_id'];
        if ($cmp === 0) {
            return strcmp(strtolower($a['name']), strtolower($b['name']));
        }
        return $cmp;
    });

    return rest_ensure_response(array_values($enriched));
}

// MOCKFUNKTION: Här behöver du koppla in ditt sätt att hämta data från Google Sheets
function kursfilter_get_sheet_data($sheet_name) {
    // Här ersätter du med faktisk logik för att läsa från Google Sheets
    return []; // Returnera en array av rader med associerade nycklar
}
