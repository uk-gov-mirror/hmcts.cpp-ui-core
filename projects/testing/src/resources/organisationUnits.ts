interface OrganisationUnit {
  id: string;
  oucodeL3Name: string;
  courtrooms: Array<{
    id: string;
    courtroomName: string;
  }>;
}

export const LAVENDAR_HILL_MAGISTRATES_COURT: OrganisationUnit = {
  id: 'f8254db1-1683-483e-afb3-b87fde5a0a26',
  oucodeL3Name: `Lavender Hill Magistrates' Court`,
  courtrooms: [
    { id: '9e4932f7-97b2-3010-b942-ddd2624e4dd8', courtroomName: 'Courtroom 01' },
    { id: 'b4562684-9209-3ec4-a544-7f80dabd94d8', courtroomName: 'Courtroom 02' },
    { id: 'f1ead1d2-4b26-3230-b781-508d6aaafd26', courtroomName: 'Courtroom 03' },
    { id: 'b6cc0e08-6227-3786-8ebe-36febddec7ff', courtroomName: 'Courtroom 04' }
  ]
};

export const LIVERPOOL_CROWN_COURT: OrganisationUnit = {
  id: '9b583616-049b-30f9-a14f-028a53b7cfe8',
  oucodeL3Name: 'Liverpool Crown Court',
  courtrooms: [
    { id: '7cb09222-49e1-3622-a5a6-ad253d2b3c39', courtroomName: 'Crown Court 3-1' },
    { id: 'a5e56fa9-c4a6-300a-98e3-2596895f0305', courtroomName: 'Crown Court 3-2' },
    { id: 'd54eae66-32e7-31da-84f1-66e24ec08d29', courtroomName: 'Crown Court 3-3' },
    { id: '3613ed6d-f727-317e-842e-ce437c4dc632', courtroomName: 'Crown Court 4-1' },
    { id: 'd8b5a2cd-a100-3912-861f-f7b93147d01f', courtroomName: 'Crown Court 4-2' },
    { id: 'b890bd6d-6903-3d4d-af01-3c41df38bfb6', courtroomName: 'Crown Court 4-3' },
    { id: 'c4d71387-a21f-30a1-b09b-b777a67961ab', courtroomName: 'Crown Court 4-4' },
    { id: 'b61a5a89-0b19-3f8b-a98f-3ba5c15b7254', courtroomName: 'Crown Court 4-5' },
    { id: '6508af42-e4d4-396d-a752-d676ebd38f6d', courtroomName: 'Crown Court 4-6' },
    { id: '414ecb12-f91f-3031-b9ce-f40c48c3f620', courtroomName: 'Crown Court 5-1' },
    { id: 'eab274c1-8879-3f08-9c42-1a7673e7100a', courtroomName: 'Crown Court 5-2' },
    { id: 'fbe3ca1a-6be6-3bd5-86e8-fc879aa5e3e7', courtroomName: 'Crown Court 5-3' },
    { id: 'a92d8cb1-69b4-37c4-9fb0-9e1d508eaebc', courtroomName: 'Crown Court 5-4' },
    { id: '0997c600-8dc5-330b-81b1-94cb6fcec37f', courtroomName: 'Crown Court 5-5' },
    { id: '8a6178d5-ad30-3d75-92ea-e44a12c50a52', courtroomName: 'Crown Court 5-6' },
    { id: '106b248f-ac0f-39b4-a64c-7d90356d0771', courtroomName: 'Crown Court 6-1' },
    { id: '39b885b5-034f-30cb-83ca-e45982230402', courtroomName: 'Crown Court 6-2' }
  ]
};
