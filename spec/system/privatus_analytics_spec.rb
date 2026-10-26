# frozen_string_literal: true

RSpec.describe "Privatus Analytics theme component" do
  let!(:component) { upload_theme_component }
  fab!(:user)
  fab!(:moderator)
  fab!(:admin)

  let(:tag) { "script[data-privatus-discourse]" }

  def configure(**values)
    values.each { |name, value| component.update_setting(name, value) }
    component.save!
  end

  before { configure(site_id: "pa_TEST123") }

  it "adds the tracker for visitors who are not logged in" do
    visit "/"

    expect(page).to have_css(
      "head #{tag}[src='https://privatusstats.com/js/pa.js'][data-site='pa_TEST123']",
      visible: false,
    )
    script = find(tag, visible: false)
    expect(script[:defer]).to be_truthy
    expect(script["data-modules"]).to eq("engage,auto,vitals,clicks,ask")
    expect(script["data-exclude"]).to eq("/admin,/admin/*")
    expect(script["data-api"]).to be_nil
    expect(script["data-debug"]).to be_nil
  end

  it "adds the tracker only once while moving between pages" do
    Fabricate(:post)
    visit "/latest"
    find(".topic-list-item .raw-topic-link", match: :first).click
    expect(page).to have_css("#topic-title")

    expect(page).to have_css(tag, visible: false, count: 1)
  end

  it "adds nothing without a valid site id" do
    configure(site_id: "not-a-site-id")
    visit "/"

    expect(page).to have_css("#main-outlet")
    expect(page).to have_no_css(tag, visible: false)
  end

  context "when staff are left out (the default)" do
    it "leaves out admins" do
      sign_in(admin)
      visit "/"

      expect(page).to have_css("#main-outlet")
      expect(page).to have_no_css(tag, visible: false)
    end

    it "leaves out moderators" do
      sign_in(moderator)
      visit "/"

      expect(page).to have_css("#main-outlet")
      expect(page).to have_no_css(tag, visible: false)
    end

    it "counts regular members" do
      sign_in(user)
      visit "/"

      expect(page).to have_css(tag, visible: false)
    end
  end

  context "when only admins are left out" do
    before { configure(do_not_count: "admins") }

    it "counts moderators and leaves out admins" do
      sign_in(moderator)
      visit "/"
      expect(page).to have_css(tag, visible: false)

      sign_in(admin)
      visit "/"
      expect(page).to have_css("#main-outlet")
      expect(page).to have_no_css(tag, visible: false)
    end
  end

  context "when nobody is left out" do
    before { configure(do_not_count: "nobody") }

    it "counts admins" do
      sign_in(admin)
      visit "/"

      expect(page).to have_css(tag, visible: false)
    end
  end

  it "uses a custom script domain for the script and the hits" do
    configure(script_domain: "https://Stats.Example.com/")
    visit "/"

    script = find(tag, visible: false)
    expect(script[:src]).to eq("https://stats.example.com/js/pa.js")
    expect(script["data-api"]).to eq("https://stats.example.com")
  end

  it "passes modules, paths and debug through" do
    configure(modules: "engage, vitals, <bad>", exclude_paths: "/u/*|/search", debug: true)
    visit "/"

    script = find(tag, visible: false)
    expect(script["data-modules"]).to eq("engage,vitals")
    expect(script["data-exclude"]).to eq("/u/*,/search")
    expect(script["data-debug"]).to eq("true")
  end
end
