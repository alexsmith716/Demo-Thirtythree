import { GoogleBooksAPI } from '../googleBooksAPI';

const mocks = {
	get: jest.fn(),
};

const ds = new GoogleBooksAPI();
ds.get = mocks.get;

// use `.toHaveBeenCalledWith/.toBeCalledWith` to ensure mock function was called with specific arguments

describe('[GoogleBooksAPI.bookReducer]', () => {
	it('properly transforms book', () => {
		expect(ds.bookReducer(mockBookResponse)).toEqual(mockBookBook);
	});
});

describe('[GoogleBooksAPI.getBook]', () => {
	it('should look up single book from api', async () => {
		mocks.get.mockReturnValueOnce(mockBookResponse);
		const res = await ds.getBook({ id: 'uW_zzQEACAAJ' });

		expect(res).toEqual(mockBookBook);
	});
});

describe('[GoogleBooksAPI.getBooks]', () => {
	it('looks up books from api', async () => {
		mocks.get.mockReturnValueOnce(mockBooksResponse);
		const searchString = 'kaplan test prep';
		const orderBy = 'newest';
		const res = await ds.getBooks(searchString, orderBy);

		expect(res).toEqual([mockBooksBook]);
	});
});

/**
 * MOCK DATA BELOW
 */

export const mockBookBook = {
	id: 'uW_zzQEACAAJ',
	cursor: 'uW_zzQEACAAJ',
	title: 'MCAT Physics and Math Review 2022-2023',
	authors: [ 'Kaplan Test Prep' ],
	publisher: 'Kaplan Publishing',
	publishedDate: '2021-07-06',
	description: '<b>Kaplan’s<i> MCAT Physics and Math Review 2022–2023 </i>offers an expert study plan, detailed subject review, and hundreds of online and in-book practice questions—all authored by the experts behind the MCAT prep course that has helped more people get into medical school than all other major courses combined.</b><br><br> Prepping for the MCAT is a true challenge. Kaplan can be your partner along the way—offering guidance on where to focus your efforts and how to organize your review. This book has been updated to match the AAMC’s guidelines precisely—no more worrying about whether your MCAT review is comprehensive!<br><br><i>The Most Practice</i><br><ul><li>More than 350 questions in the book and access to even more online—more practice than any other MCAT physics and math book on the market.</li></ul><br><i>The Best Practice</i><br><ul><li>Comprehensive physics and math subject review is written by top-rated, award-winning Kaplan instructors.</li><li>Full-color, 3-D illustrations from Scientific American, charts, graphs and diagrams help turn even the most complex science into easy-to-visualize concepts.</li><li>All material is vetted by editors with advanced science degrees and by a medical doctor.</li><li>Online resources, including a full-length practice test, help you practice in the same computer-based format you’ll see on Test Day.</li></ul><br><i>Expert Guidance</i><br><ul><li>High-yield badges throughout the book identify the top 100 topics most tested by the AAMC.</li><li>We know the test: The Kaplan MCAT team has spent years studying every MCAT-related document available. </li><li>Kaplan’s expert psychometricians ensure our practice questions and study materials are true to the test.</li></ul>',
	previewLink: 'http://books.google.com/books?id=uW_zzQEACAAJ&hl=&source=gbs_api',
	smallThumbnail: 'http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE72XJEFAGe-1GZaWa1lIQk-Dfb11hClDf5V94UbaQamcVQLXrkyl_DTjFvc2t9Nc4cPPTSpUXaRzGOJpIoKlSqKLB4Nd1JygtR_mh_-6ehnH5Y2r0JB0VZI5So0fErq9vnNa1wHD&source=gbs_api',
	favorite: false
};

export const mockBookResponse = {
	kind: 'books#volume',
	id: 'uW_zzQEACAAJ',
	etag: 'H/uB2Ah/6zw',
	selfLink: 'https://www.googleapis.com/books/v1/volumes/uW_zzQEACAAJ',
	volumeInfo: {
		title: 'MCAT Physics and Math Review 2022-2023',
		subtitle: 'Online + Book',
		authors: [ 'Kaplan Test Prep' ],
		publisher: 'Kaplan Publishing',
		publishedDate: '2021-07-06',
		description: '<b>Kaplan’s<i> MCAT Physics and Math Review 2022–2023 </i>offers an expert study plan, detailed subject review, and hundreds of online and in-book practice questions—all authored by the experts behind the MCAT prep course that has helped more people get into medical school than all other major courses combined.</b><br><br> Prepping for the MCAT is a true challenge. Kaplan can be your partner along the way—offering guidance on where to focus your efforts and how to organize your review. This book has been updated to match the AAMC’s guidelines precisely—no more worrying about whether your MCAT review is comprehensive!<br><br><i>The Most Practice</i><br><ul><li>More than 350 questions in the book and access to even more online—more practice than any other MCAT physics and math book on the market.</li></ul><br><i>The Best Practice</i><br><ul><li>Comprehensive physics and math subject review is written by top-rated, award-winning Kaplan instructors.</li><li>Full-color, 3-D illustrations from Scientific American, charts, graphs and diagrams help turn even the most complex science into easy-to-visualize concepts.</li><li>All material is vetted by editors with advanced science degrees and by a medical doctor.</li><li>Online resources, including a full-length practice test, help you practice in the same computer-based format you’ll see on Test Day.</li></ul><br><i>Expert Guidance</i><br><ul><li>High-yield badges throughout the book identify the top 100 topics most tested by the AAMC.</li><li>We know the test: The Kaplan MCAT team has spent years studying every MCAT-related document available. </li><li>Kaplan’s expert psychometricians ensure our practice questions and study materials are true to the test.</li></ul>',
		industryIdentifiers: [ [Object], [Object] ],
		readingModes: { text: false, image: false },
		pageCount: 512,
		printedPageCount: 512,
		dimensions: { height: '27.60 cm', width: '21.30 cm', thickness: '1.50 cm' },
		printType: 'BOOK',
		categories: [
			'Study Aids / MCAT (Medical College Admission Test)',
			'Study Aids / Study Guides',
			'Science / Physics / General'
		],
		maturityRating: 'NOT_MATURE',
		allowAnonLogging: false,
		contentVersion: 'preview-1.0.0',
		panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
		imageLinks: {
			smallThumbnail: 'http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE72XJEFAGe-1GZaWa1lIQk-Dfb11hClDf5V94UbaQamcVQLXrkyl_DTjFvc2t9Nc4cPPTSpUXaRzGOJpIoKlSqKLB4Nd1JygtR_mh_-6ehnH5Y2r0JB0VZI5So0fErq9vnNa1wHD&source=gbs_api',
			thumbnail: 'http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE7212K86GoCq-kBjS9WvF95xOiKO6MG1ALbMjE0hklIPGkHwMwUkbuSlo1-oeTHK95BdkH8xxMwFz2C1snUaS-EXGkBJJYtyH-TWHBv-feiHIZbHirG4A42gHoH5XJCmSLj54_Wx&source=gbs_api'
		},
		language: 'en',
		previewLink: 'http://books.google.com/books?id=uW_zzQEACAAJ&hl=&source=gbs_api',
		infoLink: 'https://play.google.com/store/books/details?id=uW_zzQEACAAJ&source=gbs_api',
		canonicalVolumeLink: 'https://play.google.com/store/books/details?id=uW_zzQEACAAJ'
	},
	saleInfo: { country: 'US', saleability: 'NOT_FOR_SALE', isEbook: false },
	accessInfo: {
		country: 'US',
		viewability: 'NO_PAGES',
		embeddable: false,
		publicDomain: false,
		textToSpeechPermission: 'ALLOWED',
		epub: { isAvailable: false },
		pdf: { isAvailable: false },
		webReaderLink: 'http://play.google.com/books/reader?id=uW_zzQEACAAJ&hl=&printsec=frontcover&source=gbs_api',
		accessViewStatus: 'NONE',
		quoteSharingAllowed: false
	}
};

export const mockBooksBook = {
	id: 'uW_zzQEACAAJ',
	cursor: 'uW_zzQEACAAJ',
	title: 'MCAT Physics and Math Review 2022-2023',
	authors: [ 'Kaplan Test Prep' ],
	publisher: 'Kaplan Publishing',
	publishedDate: '2021-07-06',
	description: 'Kaplan’s MCAT Physics and Math Review 2022–2023 offers an expert study plan, detailed subject review, and hundreds of online and in-book practice questions—all authored by the experts behind the MCAT prep course that has helped more people get into medical school than all other major courses combined. Prepping for the MCAT is a true challenge. Kaplan can be your partner along the way—offering guidance on where to focus your efforts and how to organize your review. This book has been updated to match the AAMC’s guidelines precisely—no more worrying about whether your MCAT review is comprehensive! The Most Practice More than 350 questions in the book and access to even more online—more practice than any other MCAT physics and math book on the market. The Best Practice Comprehensive physics and math subject review is written by top-rated, award-winning Kaplan instructors. Full-color, 3-D illustrations from Scientific American, charts, graphs and diagrams help turn even the most complex science into easy-to-visualize concepts. All material is vetted by editors with advanced science degrees and by a medical doctor. Online resources, including a full-length practice test, help you practice in the same computer-based format you’ll see on Test Day. Expert Guidance High-yield badges throughout the book identify the top 100 topics most tested by the AAMC. We know the test: The Kaplan MCAT team has spent years studying every MCAT-related document available. Kaplan’s expert psychometricians ensure our practice questions and study materials are true to the test.',
	previewLink: 'http://books.google.com/books?id=uW_zzQEACAAJ&dq=kaplan+test+prep&hl=&cd=1&source=gbs_api',
	smallThumbnail: 'http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
	favorite: false
};

export const mockBooksResponse = {
	items: [{
		kind: "books#volume",
		id: "uW_zzQEACAAJ",
		etag: "rwAYjbkgZyA",
		selfLink: "https://www.googleapis.com/books/v1/volumes/uW_zzQEACAAJ",
		volumeInfo: {
			title: "MCAT Physics and Math Review 2022-2023",
			subtitle: "Online + Book",
			authors: ["Kaplan Test Prep"],
			publisher: "Kaplan Publishing",
			publishedDate: "2021-07-06",
			description: "Kaplan’s MCAT Physics and Math Review 2022–2023 offers an expert study plan, detailed subject review, and hundreds of online and in-book practice questions—all authored by the experts behind the MCAT prep course that has helped more people get into medical school than all other major courses combined. Prepping for the MCAT is a true challenge. Kaplan can be your partner along the way—offering guidance on where to focus your efforts and how to organize your review. This book has been updated to match the AAMC’s guidelines precisely—no more worrying about whether your MCAT review is comprehensive! The Most Practice More than 350 questions in the book and access to even more online—more practice than any other MCAT physics and math book on the market. The Best Practice Comprehensive physics and math subject review is written by top-rated, award-winning Kaplan instructors. Full-color, 3-D illustrations from Scientific American, charts, graphs and diagrams help turn even the most complex science into easy-to-visualize concepts. All material is vetted by editors with advanced science degrees and by a medical doctor. Online resources, including a full-length practice test, help you practice in the same computer-based format you’ll see on Test Day. Expert Guidance High-yield badges throughout the book identify the top 100 topics most tested by the AAMC. We know the test: The Kaplan MCAT team has spent years studying every MCAT-related document available. Kaplan’s expert psychometricians ensure our practice questions and study materials are true to the test.",
			readingModes: {
				text: false,
				image: false
			},
			maturityRating: "NOT_MATURE",
			allowAnonLogging: false,
			contentVersion: "preview-1.0.0",
			panelizationSummary: {
				containsEpubBubbles: false,
				containsImageBubbles: false
			},
			imageLinks: {
				smallThumbnail: "http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
				thumbnail: "http://books.google.com/books/content?id=uW_zzQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
			},
			previewLink: "http://books.google.com/books?id=uW_zzQEACAAJ&dq=kaplan+test+prep&hl=&cd=1&source=gbs_api",
			infoLink: "http://books.google.com/books?id=uW_zzQEACAAJ&dq=kaplan+test+prep&hl=&source=gbs_api",
			canonicalVolumeLink: "https://books.google.com/books/about/MCAT_Physics_and_Math_Review_2022_2023.html?hl=&id=uW_zzQEACAAJ"
		},
		saleInfo: {
			country: "US"
		},
		accessInfo: {
			country: "US",
			epub: {
				isAvailable: false
			},
			pdf: {
				isAvailable: false
			},
			accessViewStatus: "NONE"
		},
		searchInfo: {
			textSnippet: "This book has been updated to match the AAMC’s guidelines precisely—no more worrying about whether your MCAT review is comprehensive!"
		}
	}]
};
