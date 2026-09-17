<?php

// =====================================================
// CONFIGURATION
// =====================================================

$SEO_API = "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";
$SITE_URL = "https://theroyalkraft.com";
$SITE_NAME = "The Royal Kraft";


// =====================================================
// GET CURRENT URL
// =====================================================

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$path = rtrim($path, "/");


// =====================================================
// FIND CURRENT SEO PAGE
// =====================================================

if ($path === "") {

    $page = "Home";

} elseif ($path === "/product") {

    $page = "Product";

} elseif ($path === "/project" || strpos($path, "/project/") === 0) {

    $page = "Project";

} elseif ($path === "/service") {

    $page = "Service";

} elseif ($path === "/shop" || strpos($path, "/shop/") === 0) {

    $page = "Shop";

} elseif ($path === "/blog") {

    $page = "Blog";

} elseif ($path === "/gallery") {

    $page = "Gallery";

} elseif ($path === "/about") {

    $page = "About";

} elseif ($path === "/contact") {

    $page = "Contact";

} else {

    $page = "Home";
}


// =====================================================
// DEFAULT SEO
// =====================================================

$seo = [

    "metaTitle" =>
        $SITE_NAME,

    "metaDescription" =>
        "The Royal Kraft provides architectural and decorative FRP solutions.",

    "metaKeywords" =>
        "The Royal Kraft, FRP, architectural, decorative, FRP products",

    "canonicalUrl" =>
        $SITE_URL . "/"

];


// =====================================================
// GET SEO FROM AWS
// =====================================================

if (function_exists("curl_init")) {

    $ch = curl_init(
        $SEO_API . "?t=" . time()
    );

    curl_setopt_array($ch, [

        CURLOPT_RETURNTRANSFER => true,

        CURLOPT_FOLLOWLOCATION => true,

        CURLOPT_TIMEOUT => 10,

        CURLOPT_CONNECTTIMEOUT => 5,

        CURLOPT_HTTPHEADER => [
            "Accept: application/json"
        ]

    ]);

    $response = curl_exec($ch);

    curl_close($ch);


    if ($response !== false) {

        $seoList = json_decode(
            $response,
            true
        );


        if (is_array($seoList)) {

            foreach ($seoList as $item) {

                if (
                    isset($item["page"]) &&
                    strtolower(trim($item["page"])) ===
                    strtolower($page)
                ) {

                    if (
                        !empty(
                            trim(
                                $item["metaTitle"] ?? ""
                            )
                        )
                    ) {

                        $seo["metaTitle"] =
                            trim(
                                $item["metaTitle"]
                            );

                    }


                    if (
                        !empty(
                            trim(
                                $item["metaDescription"] ?? ""
                            )
                        )
                    ) {

                        $seo["metaDescription"] =
                            trim(
                                $item["metaDescription"]
                            );

                    }


                    if (
                        !empty(
                            trim(
                                $item["metaKeywords"] ?? ""
                            )
                        )
                    ) {

                        $seo["metaKeywords"] =
                            trim(
                                $item["metaKeywords"]
                            );

                    }


                    if (
                        !empty(
                            trim(
                                $item["canonicalUrl"] ?? ""
                            )
                        )
                    ) {

                        $seo["canonicalUrl"] =
                            trim(
                                $item["canonicalUrl"]
                            );

                    }

                    break;
                }
            }
        }
    }
}


// =====================================================
// DEFAULT CANONICAL
// =====================================================

if ($page === "Home") {

    $defaultCanonical =
        $SITE_URL . "/";

} elseif ($page === "Product") {

    $defaultCanonical =
        $SITE_URL . "/product";

} elseif ($page === "Project") {

    $defaultCanonical =
        $SITE_URL . "/project";

} elseif ($page === "Service") {

    $defaultCanonical =
        $SITE_URL . "/service";

} elseif ($page === "Shop") {

    $defaultCanonical =
        $SITE_URL . "/shop";

} elseif ($page === "Blog") {

    $defaultCanonical =
        $SITE_URL . "/blog";

} elseif ($page === "Gallery") {

    $defaultCanonical =
        $SITE_URL . "/gallery";

} elseif ($page === "About") {

    $defaultCanonical =
        $SITE_URL . "/about";

} elseif ($page === "Contact") {

    $defaultCanonical =
        $SITE_URL . "/contact";

} else {

    $defaultCanonical =
        $SITE_URL . "/";

}


if (
    empty(
        trim(
            $seo["canonicalUrl"] ?? ""
        )
    )
) {

    $seo["canonicalUrl"] =
        $defaultCanonical;
}


// =====================================================
// ESCAPE SEO VALUES
// =====================================================

$title = htmlspecialchars(
    $seo["metaTitle"],
    ENT_QUOTES,
    "UTF-8"
);

$description = htmlspecialchars(
    $seo["metaDescription"],
    ENT_QUOTES,
    "UTF-8"
);

$keywords = htmlspecialchars(
    $seo["metaKeywords"],
    ENT_QUOTES,
    "UTF-8"
);

$canonical = htmlspecialchars(
    $seo["canonicalUrl"],
    ENT_QUOTES,
    "UTF-8"
);

$siteNameEscaped = htmlspecialchars(
    $SITE_NAME,
    ENT_QUOTES,
    "UTF-8"
);


// =====================================================
// SCHEMA DATA
// =====================================================

$schema = [

    "@context" =>
        "https://schema.org",

    "@type" =>
        "WebPage",

    "@id" =>
        $seo["canonicalUrl"] . "#webpage",

    "url" =>
        $seo["canonicalUrl"],

    "name" =>
        $seo["metaTitle"],

    "description" =>
        $seo["metaDescription"],

    "publisher" => [

        "@type" =>
            "Organization",

        "@id" =>
            $SITE_URL . "/#organization",

        "name" =>
            $SITE_NAME,

        "url" =>
            $SITE_URL,

        "logo" => [

            "@type" =>
                "ImageObject",

            "url" =>
                $SITE_URL . "/og-image.jpg"

        ]

    ],

    "primaryImageOfPage" => [

        "@type" =>
            "ImageObject",

        "url" =>
            $SITE_URL . "/og-image.jpg"

    ]

];


// =====================================================
// HOME SCHEMA
// =====================================================

if ($page === "Home") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@graph" => [

            [

                "@type" =>
                    "Organization",

                "@id" =>
                    $SITE_URL . "/#organization",

                "name" =>
                    $SITE_NAME,

                "url" =>
                    $SITE_URL,

                "logo" => [

                    "@type" =>
                        "ImageObject",

                    "url" =>
                        $SITE_URL . "/og-image.jpg"

                ]

            ],

            [

                "@type" =>
                    "LocalBusiness",

                "@id" =>
                    $SITE_URL . "/#localbusiness",

                "name" =>
                    $SITE_NAME,

                "url" =>
                    $SITE_URL,

                "image" =>
                    $SITE_URL . "/og-image.jpg",

                "telephone" =>
                    "+91-8130462200",

                "email" =>
                    "info@theroyalkraft.com",

                "address" => [

                    "@type" =>
                        "PostalAddress",

                    "streetAddress" =>
                        "108, First Floor, DLF Galleria Mall, Mayur Vihar Phase-1 Extension, Near Metro Mayur Vihar Extension",

                    "addressLocality" =>
                        "New Delhi",

                    "postalCode" =>
                        "110091",

                    "addressCountry" =>
                        "IN"

                ],

                "parentOrganization" => [

                    "@id" =>
                        $SITE_URL . "/#organization"

                ]

            ]

        ]

    ];

}


// =====================================================
// ABOUT SCHEMA
// =====================================================

elseif ($page === "About") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "AboutPage",

        "@id" =>
            $seo["canonicalUrl"] . "#aboutpage",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "about" => [

            "@id" =>
                $SITE_URL . "/#organization"

        ],

        "primaryImageOfPage" => [

            "@type" =>
                "ImageObject",

            "url" =>
                $SITE_URL . "/og-image.jpg"

        ]

    ];

}


// =====================================================
// PRODUCT SCHEMA
// =====================================================

elseif ($page === "Product") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "CollectionPage",

        "@id" =>
            $seo["canonicalUrl"] . "#product-category",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "about" => [

            "@type" =>
                "Thing",

            "name" =>
                "FRP Architectural and Decorative Products"

        ],

        "mainEntity" => [

            "@type" =>
                "ItemList",

            "@id" =>
                $seo["canonicalUrl"] . "#itemlist",

            "name" =>
                "The Royal Kraft Products",

            "itemListOrder" =>
                "https://schema.org/ItemListOrderAscending",

            "numberOfItems" =>
                0

        ]

    ];

}


// =====================================================
// SHOP SCHEMA
// =====================================================

elseif ($page === "Shop") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@graph" => [

            [

                "@type" =>
                    "CollectionPage",

                "@id" =>
                    $seo["canonicalUrl"] . "#shop",

                "url" =>
                    $seo["canonicalUrl"],

                "name" =>
                    $seo["metaTitle"],

                "description" =>
                    $seo["metaDescription"],

                "mainEntity" => [

                    "@type" =>
                        "ItemList",

                    "@id" =>
                        $seo["canonicalUrl"] . "#itemlist",

                    "name" =>
                        "The Royal Kraft Shop",

                    "itemListOrder" =>
                        "https://schema.org/ItemListOrderAscending",

                    "numberOfItems" =>
                        0

                ],

                "provider" => [

                    "@id" =>
                        $SITE_URL . "/#organization"

                ]

            ],

            [

                "@type" =>
                    "BreadcrumbList",

                "@id" =>
                    $seo["canonicalUrl"] . "#breadcrumb",

                "itemListElement" => [

                    [

                        "@type" =>
                            "ListItem",

                        "position" =>
                            1,

                        "name" =>
                            "Home",

                        "item" =>
                            $SITE_URL . "/"

                    ],

                    [

                        "@type" =>
                            "ListItem",

                        "position" =>
                            2,

                        "name" =>
                            "Shop",

                        "item" =>
                            $SITE_URL . "/shop"

                    ]

                ]

            ]

        ]

    ];

}


// =====================================================
// SERVICE SCHEMA
// =====================================================

elseif ($page === "Service") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "Service",

        "@id" =>
            $seo["canonicalUrl"] . "#service",

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "url" =>
            $seo["canonicalUrl"],

        "image" =>
            $SITE_URL . "/og-image.jpg",

        "provider" => [

            "@id" =>
                $SITE_URL . "/#organization"

        ],

        "areaServed" => [

            "@type" =>
                "Country",

            "name" =>
                "India"

        ]

    ];

}


// =====================================================
// PROJECT SCHEMA
// =====================================================

elseif ($page === "Project") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "CollectionPage",

        "@id" =>
            $seo["canonicalUrl"] . "#projects",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "about" => [

            "@type" =>
                "Thing",

            "name" =>
                "Architectural and Decorative Projects"

        ],

        "mainEntity" => [

            "@type" =>
                "ItemList",

            "@id" =>
                $seo["canonicalUrl"] . "#itemlist",

            "name" =>
                "The Royal Kraft Projects",

            "itemListOrder" =>
                "https://schema.org/ItemListOrderAscending",

            "numberOfItems" =>
                0

        ],

        "provider" => [

            "@id" =>
                $SITE_URL . "/#organization"

        ]

    ];

}


// =====================================================
// BLOG SCHEMA
// =====================================================

elseif ($page === "Blog") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "Blog",

        "@id" =>
            $seo["canonicalUrl"] . "#blog",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "publisher" => [

            "@id" =>
                $SITE_URL . "/#organization"

        ],

        "image" =>
            $SITE_URL . "/og-image.jpg"

    ];

}


// =====================================================
// GALLERY SCHEMA
// =====================================================

elseif ($page === "Gallery") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "ImageGallery",

        "@id" =>
            $seo["canonicalUrl"] . "#imagegallery",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "image" =>
            $SITE_URL . "/og-image.jpg",

        "publisher" => [

            "@id" =>
                $SITE_URL . "/#organization"

        ]

    ];

}


// =====================================================
// CONTACT SCHEMA
// =====================================================

elseif ($page === "Contact") {

    $schema = [

        "@context" =>
            "https://schema.org",

        "@type" =>
            "ContactPage",

        "@id" =>
            $seo["canonicalUrl"] . "#contactpage",

        "url" =>
            $seo["canonicalUrl"],

        "name" =>
            $seo["metaTitle"],

        "description" =>
            $seo["metaDescription"],

        "isPartOf" => [

            "@type" =>
                "WebSite",

            "name" =>
                $SITE_NAME,

            "url" =>
                $SITE_URL

        ]

    ];

}


// =====================================================
// CONVERT SCHEMA TO JSON
// =====================================================

$schemaJson = json_encode(

    $schema,

    JSON_UNESCAPED_SLASHES |
    JSON_UNESCAPED_UNICODE |
    JSON_PRETTY_PRINT

);


// =====================================================
// READ REACT INDEX.HTML
// =====================================================

$template = __DIR__ . "/index.html";

if (!file_exists($template)) {

    http_response_code(500);

    exit("index.html not found.");

}

$html = file_get_contents($template);


// =====================================================
// REMOVE EXISTING SEO TAGS
// =====================================================

$html = preg_replace(
    '/<title\b[^>]*>.*?<\/title>/is',
    '',
    $html
);

$html = preg_replace(
    '/<meta\s+name=["\']description["\'][^>]*>/i',
    '',
    $html
);

$html = preg_replace(
    '/<meta\s+name=["\']keywords["\'][^>]*>/i',
    '',
    $html
);

$html = preg_replace(
    '/<link\s+rel=["\']canonical["\'][^>]*>/i',
    '',
    $html
);

$html = preg_replace(
    '/<meta\s+property=["\']og:[^>]*>/i',
    '',
    $html
);

$html = preg_replace(
    '/<meta\s+name=["\']twitter:[^>]*>/i',
    '',
    $html
);

$html = preg_replace(
    '/<script\s+type=["\']application\/ld\+json["\'][^>]*>.*?<\/script>/is',
    '',
    $html
);


// =====================================================
// CREATE SEO HTML
// =====================================================

$seoTags = '

    <title>' . $title . '</title>

    <meta name="description" content="' . $description . '">

    <meta name="keywords" content="' . $keywords . '">

    <link rel="canonical" href="' . $canonical . '">

    <!-- Open Graph -->

    <meta property="og:title" content="' . $title . '">

    <meta property="og:description" content="' . $description . '">

    <meta property="og:type" content="website">

    <meta property="og:url" content="' . $canonical . '">

    <meta property="og:site_name" content="' . $siteNameEscaped . '">

    <meta property="og:image" content="' .
        $SITE_URL .
        '/og-image.jpg">

    <!-- Twitter -->

    <meta name="twitter:card" content="summary_large_image">

    <meta name="twitter:title" content="' . $title . '">

    <meta name="twitter:description" content="' . $description . '">

    <meta name="twitter:image" content="' .
        $SITE_URL .
        '/og-image.jpg">

    <!-- Schema.org -->

    <script type="application/ld+json">
' . $schemaJson . '
    </script>
';


// =====================================================
// INSERT SEO BEFORE </head>
// =====================================================

$html = preg_replace(

    '/<\/head>/i',

    $seoTags . "\n  </head>",

    $html,

    1

);


// =====================================================
// DISABLE HTML CACHING
// =====================================================

header(
    "Content-Type: text/html; charset=UTF-8"
);

header(
    "Cache-Control: no-store, no-cache, must-revalidate, max-age=0"
);

header(
    "Pragma: no-cache"
);

header(
    "Expires: 0"
);


// =====================================================
// OUTPUT
// =====================================================

echo $html;

?>